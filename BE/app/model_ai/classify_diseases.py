"""
Classify diseases into nhóm bệnh based on medical knowledge.
Run from BE/ directory: python app/model_ai/classify_diseases.py
"""
import sys
sys.path.insert(0, ".")

from app.database.session import SessionLocal
from app.database.dm_benh import DmBenh
from sqlalchemy import text


# Key: exact disease name (lowercase) → group code
# For diseases where keyword matching would be ambiguous
EXACT_MAP = {
    # === Blood / Hematology → XIV ===
    "bệnh đa hồng cầu": "XIV",
    "bệnh máu khó đông": "XIV",
    "khủng hoảng hồng cầu hình liềm": "XIV",
    "thiếu máu không tái tạo": "XIV",
    "thiếu máu hồng cầu hình liềm": "XIV",
    "thiếu máu tán huyết": "XIV",
    "thiếu máu do bệnh thận mãn tính": "XIV",
    "giảm tiểu cầu": "XIV",
    "rối loạn đông máu (chảy máu)": "XIV",
    "rối loạn tế bào bạch cầu": "XIV",
    "bệnh đa u tủy": "XIV",
    "suy giảm miễn dịch nguyên phát": "XIV",
    "bệnh sacoit": "XIV",
    "sarcoma mô mềm": "XIV",
    "khối u ác tính": "XIV",
    "ung thư di căn": "XIV",
    "ung thư hạch": "XIV",
    "khối tim": "XIV",

    # === Pregnancy / Obstetric → XIV
    "mang thai": "XIV",
    "mang thai ngoài tử cung": "XIV",
    "dọa mang thai": "XIV",
    "sảy thai tự nhiên": "XIV",
    "phá thai gây ra": "XIV",
    "phá thai lỡ": "XIV",
    "chứng nôn nghén nặng": "XIV",
    "tiểu đường thai kỳ": "XIV",
    "tăng huyết áp thai kỳ": "XIV",
    "tiền sản giật": "XIV",
    "vấn đề khi mang thai": "XIV",
    "nốt ruồi hydatidiform": "XIV",
    "đờ tử cung": "XIV",
    "vàng da sơ sinh": "XIV",

    # === Congenital / Developmental → XIV
    "dị tật tim bẩm sinh": "XIV",
    "hội chứng down": "XIV",
    "khuyết tật phát triển": "XIV",
    "tật nứt đốt sống": "XIV",
    "não úng thủy": "XIV",
    "hội chứng mọc răng": "XIV",

    # === Oncology → XIV (general cancers)
    "ung thư buồng trứng": "XIV",
    "ung thư bàng quang": "XIV",
    "ung thư cổ tử cung": "XIV",
    "ung thư da": "XIV",
    "ung thư dạ dày": "XIV",
    "ung thư gan": "XIV",
    "ung thư não": "XIV",
    "ung thư nội mạc tử cung": "XIV",
    "ung thư phổi": "XIV",
    "ung thư thận": "XIV",
    "ung thư thực quản": "XIV",
    "ung thư tuyến tiền liệt": "XIV",
    "ung thư tuyến tụy": "XIV",
    "ung thư xương": "XIV",
    "ung thư đường ruột": "XIV",
    "ung thư đại trực tràng": "XIV",
    "ung thư đầu và cổ": "XIV",

    # === Ambiguous "thiếu máu" cases that are NOT nutritional → override
    "cơn thiếu máu cục bộ thoáng qua": "IV",
    "thiếu máu cục bộ ruột": "IX",
    "bệnh tim thiếu máu cục bộ": "VII",
    "cơn thiếu máu cục bộ thoáng qua": "IV",

    # === Ambiguous "viêm gan" cases
    "viêm gan do độc tố": "IX",
    "xơ gan": "IX",

    # === Ambiguous "nhiễm trùng" cases
    "nhiễm trùng da sinh mủ": "X",
    "nhiễm trùng đường tiết niệu": "XII",
    "nhiễm trùng cơ quan sinh dục nam": "XII",
    "nhiễm trùng cơ quan sinh dục nữ": "XII",
    "nhiễm trùng vú (viêm vú)": "XII",
    "nhiễm trùng sau phẫu thuật": "XIII",
    "nhiễm trùng quanh trực tràng": "IX",
    "nhiễm trùng giác mạc": "V",
    "viêm khớp nhiễm trùng": "XI",

    # === Ambiguous "nấm" cases
    "nhiễm nấm da": "X",
    "nhiễm nấm tóc": "X",
    "nhiễm nấm âm đạo": "XII",
    "nấm kẽ chân": "X",
    "bệnh nấm móng": "X",
    "bệnh tưa miệng (nhiễm nấm men)": "IX",
    "nhiễm nấm men": "XIV",

    # === Neurological (subset of infections go here)
    "viêm não": "IV",
    "viêm màng não": "IV",
    "phù não": "IV",
    "não giả": "IV",
    "bệnh não gan": "IV",
    "áp xe não": "IV",

    # === ENT vs Infectious
    "viêm tai giữa": "VI",
    "viêm tai giữa cấp tính": "VI",
    "viêm tai giữa mãn tính": "VI",
    "viêm tai ngoài (tai của người bơi lội)": "VI",
    "viêm xoang cấp tính": "VI",
    "viêm xoang mãn tính": "VI",
    "viêm họng": "VI",
    "viêm amidan": "VI",
    "viêm thanh quản": "VI",
    "viêm mũi": "VI",
    "viêm VA": "VI",

    # === Respiratory infections → keep in VIII, not I
    "viêm phổi": "VIII",
    "viêm phế quản cấp tính": "VIII",
    "viêm tiểu phế quản cấp tính": "VIII",
    "viêm khí quản": "VIII",
    "viêm thanh khí phế quản (bệnh croup)": "VIII",

    # === Eye conditions
    "viêm kết mạc": "V",
    "viêm kết mạc do dị ứng": "V",
    "viêm kết mạc do vi khuẩn": "V",
    "viêm kết mạc do virus": "V",

    # === Kidney
    "bệnh thận mãn tính": "XII",
    "bệnh thận đa nang": "XII",
    "bệnh thận nguyên phát": "XII",
    "suy thận": "XII",
    "viêm bể thận": "XII",
    "sỏi thận": "XII",
    "thận ứ nước": "XII",
    "chấn thương thận cấp tính": "XII",
    "u nang thận lành tính": "XII",

    # === Breast
    "nữ hóa tuyến vú": "XIV",
    "u nang vú": "XIV",
    "u xơ tuyến": "XIV",
    "nhiễm trùng vú (viêm vú)": "XIV",
    "khối u hoặc khối vú": "XIV",
    "vấn đề về ngực sau sinh": "XIV",
    "chảy máu hoặc chảy ra từ núm vú": "XIV",

    # === Override ambiguous keywords
    "sốt thấp khớp mãn tính": "VII",
    "gãy răng": "IX",
    "bệnh meniere": "VI",
    "hội chứng sjogren": "XI",
    "bệnh xơ cứng teo cơ một bên (als)": "IV",
    "loét tư thế nằm": "X",
    "bệnh chốc lở": "X",
    "bệnh zona (herpes zoster)": "I",
    "chấn động": "IV",
    "khối u hoặc khối ở vai": "XI",

    # Vết thương hở → XIII, not X
    "vết thương hở miệng": "XIII",
    "vết thương hở môi": "XIII",
    "vết thương hở ở bàn chân": "XIII",
    "vết thương hở ở cổ": "XIII",
    "vết thương hở ở mũi": "XIII",
    "vết thương hở ở mắt": "XIII",
    "vết thương hở ở tai": "XIII",
    "vết thương ở bụng": "XIII",
    "vết thương ở mặt": "XIII",
    "vết thương ở tay": "XIII",

    # Gãy xương specific → XIII, not XI
    "gãy cổ": "XIII",
    "gãy mắt cá chân": "XIII",
    "gãy ngón tay": "XIII",
    "gãy tay": "XIII",
    "gãy xương bàn chân": "XIII",
    "gãy xương bánh chè": "XIII",
    "gãy xương chân": "XIII",
    "gãy xương chậu": "XIII",
    "gãy xương cánh tay": "XIII",
    "gãy xương hàm": "XIII",
    "gãy xương mặt": "XIII",
    "gãy xương sườn": "XIII",
    "gãy xương sọ": "XIII",
    "gãy xương vai": "XIII",
    "gãy đốt sống": "XIII",

    # Tim bẩm sinh → VII (circulatory), not XIV
    "dị tật tim bẩm sinh": "VII",

    # Cancers of specific organs → put in appropriate group instead of XIV
    # Actually keep them in XIV (Khác) as discussed

    # Ngộ độc specific
    "ngộ độc do dùng thuốc kháng sinh": "XIII",
    "ngộ độc do khí gas": "XIII",
    "ngộ độc do thuốc an thần": "XIII",
    "ngộ độc do thuốc chống co giật": "XIII",
    "ngộ độc do thuốc chống trầm cảm": "XIII",
    "ngộ độc do thuốc giảm đau": "XIII",
    "ngộ độc khí carbon monoxide": "XIII",
    "ngộ độc rượu": "XIII",
    "ngộ độc thuốc do dùng thuốc": "XIII",

    # Extra edge cases
    "mittelschmerz": "XII",
    "ectropion": "V",
    "bệnh u nang": "XIV",
    "bệnh u xương sụn": "XI",
    "côn trùng cắn": "X",
    "mụn cóc do virus": "X",
    "bong võng mạc": "V",
    "bệnh xơ nang": "VIII",
    "bệnh phổi kẽ": "VIII",
    "viêm mũi dị ứng": "VI",
    "sổ mũi": "VI",
    "đau do cảm lạnh": "XIV",
    "hội chứng tiền đình": "VI",
    "hội chứng thị giác màn hình": "V",
    "chứng ngủ rũ": "IV",
    "lão thính": "VI",
    "bệnh máu khó đông": "XIV",
    "bệnh bạch cầu đơn nhân": "I",
    "bệnh não gan": "IV",
    "cảm lạnh thông thường": "I",
    "bệnh phổi tắc nghẽn mãn tính (copd)": "VIII",
    "bệnh trào ngược dạ dày thực quản (gerd)": "IX",

    # Fix misclassifications in XIV
    "tiểu đường thai kỳ": "II",
    "áp xe quanh amiđan": "VI",
    "bàn chân phẳng": "XI",
    "ban đỏ đa dạng": "X",
    "chứng co thắt tâm vị": "IX",
    "chứng co thắt âm đạo": "XII",
    "chứng khó tiết mồ hôi": "X",
    "co thắt cơ": "XI",
    "đau âm hộ": "XII",
    "đau bụng kinh vô căn": "XII",
    "đau đa cơ do thấp khớp": "XI",
    "bệnh sacoit": "VIII",
    "chảy máu vô căn không có kinh nguyệt": "XII",
    "dị ứng theo mùa (sốt cỏ khô)": "VI",
    "nhịp tim chậm xoang": "VII",
    "bệnh về nướu": "IX",
}

# Keywords for each group (lowercase)
# Order matters: check I first, then II, etc. to avoid false matches
KEYWORD_RULES = {
    "I": [  # Truyền nhiễm & ký sinh trùng
        "siêu vi", "giun", "ký sinh trùng", "giang mai", "lậu",
        "chlamydia", "cúm", "thủy đậu", "quai bị", "ho gà",
        "bạch cầu đơn nhân", "trichomonas", "mụn rộp sinh dục",
        "viêm gan siêu vi", "bệnh lao", "bệnh lyme",
        "bệnh ban đỏ", "ban đỏ do virus",
        "bệnh tay chân miệng", "bệnh dại", "bệnh uốn ván",
        "bệnh phong", "bệnh tả", "bệnh thương hàn",
        "sốt xuất huyết", "bệnh sởi", "bệnh rubella",
        "bệnh bại liệt", "bệnh than", "bệnh dịch hạch",
        "bệnh sốt rét",
        "nhiễm trùng huyết", "bệnh giun đũa",
        "u mềm lây",
        "bệnh ghẻ",
        "viêm dạ dày ruột truyền nhiễm",
        "bệnh herpangina (viêm họng mụn nước)",
        "bệnh zona (herpes zoster)",
        "viêm họng liên cầu khuẩn",
        "áp xe da do vi khuẩn",
        # Keep simple "nhiễm" but placed lower to allow overrides
        "bệnh ký sinh trùng",
    ],
    "II": [  # Nội tiết, dinh dưỡng, chuyển hóa
        "tiểu đường", "đái tháo đường", "bướu cổ",
        "basedow", "suy giáp", "tuyến giáp", "cường giáp",
        "tuyến yên", "tuyến thượng thận",
        "tăng cholesterol", "mỡ máu",
        "gout", "bệnh gout",
        "hạ đường huyết", "thiếu vitamin",
        "thiếu folate", "thiếu chất đạm",
        "không dung nạp lactose",
        "bệnh celiac",
        "loãng xương", "chứng loãng xương",
        "hạ canxi máu", "hạ kali máu", "hạ natri máu",
        "tăng kali máu", "tăng natri huyết",
        "béo phì", "mãn kinh",
        "rối loạn nội tiết",
        "nhiễm toan đái tháo đường",
        "bệnh tiết nhiều sữa",
        "hội chứng buồng trứng đa nang (pcos)",
        "hội chứng chuyển hóa",
        "nhân tuyến giáp",
        "teo thể hang",
        "rối loạn chuyển hóa",
        "u tuyến cận giáp",
        "u tuyến thượng thận",
        "u tuyến yên",
        "viêm tuyến giáp bán cấp",
        "suy thượng thận",
        "bệnh gai đen",
        "suy dinh dưỡng",
        # thiếu máu dinh dưỡng
        "thiếu máu",
        "thiếu sắt",
        "thiếu vitamin b12",
    ],
    "III": [  # Tâm thần & hành vi
        "trầm cảm", "lo âu", "rối loạn lưỡng cực",
        "tâm thần phân liệt", "hoảng loạn",
        "rối loạn loạn khí sắc",
        "rối loạn ám ảnh cưỡng chế",
        "rối loạn căng thẳng sau chấn thương",
        "rối loạn nhân cách",
        "rối loạn hành vi",
        "rối loạn ăn uống",
        "rối loạn tâm thần",
        "rối loạn tâm lý tình dục",
        "rối loạn kiểm soát xung lực",
        "rối loạn phân ly",
        "rối loạn chống đối",
        "rối loạn tăng động giảm chú ý",
        "rối loạn cơ thể hóa",
        "rối loạn hoảng sợ",
        "adhd", "ocd", "ptsd",
        "tự kỷ", "hội chứng asperger",
        "hội chứng tourette",
        "nghiện", "lạm dụng rượu", "lạm dụng ma túy",
        "lạm dụng cần sa",
        "cai rượu", "cai thuốc",
        "mất ngủ nguyên phát",
        "bệnh tự kỷ",
        "mê sảng",
        "sự lo lắng",
        "cơn hoảng loạn",
        "nỗi ám ảnh xã hội",
        "rối loạn tic",
        "phản ứng căng thẳng cấp tính",
        "phản ứng điều chỉnh",
        "hút thuốc hoặc nghiện thuốc lá",
        "căng thẳng hoặc khó chịu tiền kinh nguyệt",
    ],
    "IV": [  # Thần kinh
        "alzheimer", "parkinson", "động kinh",
        "đa xơ cứng", "xơ cứng teo cơ",
        "đau nửa đầu", "đau đầu căng thẳng",
        "đột quỵ", "xuất huyết não", "xuất huyết nội sọ",
        "xuất huyết dưới nhện", "xuất huyết dưới màng cứng",
        "thiếu máu cục bộ thoáng qua",
        "bại não", "liệt nửa người", "liệt chuông",
        "liệt dây thần kinh",
        "đau dây thần kinh",
        "đau thần kinh tọa",
        "viêm dây thần kinh",
        "bệnh thần kinh", "thần kinh ngoại biên",
        "bệnh xơ cứng teo cơ",
        "bệnh nhược cơ",
        "loạn dưỡng cơ",
        "run vô căn",
        "hội chứng chân bồn chồn",
        "bppv", "chóng mặt tư thế",
        "chấn động", "chấn thương đầu",
        "chấn thương tủy sống",
        "u xơ thần kinh",
        "hội chứng ống cổ tay",
        "đau thắt lưng",
        "rối loạn hệ thần kinh tự trị",
        "rối loạn thần kinh ngoại biên",
        "mất trí nhớ",
        "bệnh mất trí nhớ cơ thể lewy",
        "não giả",
        "rối loạn tic (chuyển động)",
        "bệnh thần kinh do thuốc",
        "tác dụng ngoại tháp",
        "đau đầu sau khi chọc dò tủy sống",
        "hội chứng guillain barre",
        "tác động lên dây thần kinh gần vai",
    ],
    "V": [  # Mắt
        "đục thủy tinh thể", "tăng nhãn áp",
        "loạn thị", "cận thị", "viễn thị", "lão thị",
        "nhược thị", "lác mắt", "lệch mắt",
        "bong võng mạc", "viêm võng mạc",
        "mộng thịt", "lẹo mắt", "chắp", "viêm bờ mi",
        "dị vật trong mắt", "mài mòn giác mạc",
        "rối loạn giác mạc", "viêm giác mạc",
        "viêm mống mắt", "viêm củng mạc",
        "viêm màng mạch võng mạc",
        "ruồi bay trước mắt",
        "xuất huyết thủy tinh", "xuất huyết dưới kết mạc",
        "khô mắt", "thoái hóa điểm vàng",
        "bệnh võng mạc", "bệnh tăng nhãn áp",
        "tắc động mạch hoặc tĩnh mạch trung tâm võng mạc",
        "mù lòa", "mắt đục",
        "thoái hóa thủy tinh thể",
        "hội chứng thị giác màn hình",
        "loét giác mạc",
        "viêm mô tế bào quỹ đạo",
        "viêm nội nhãn",
        "rối loạn liên kết mắt",
    ],
    "VI": [  # Tai - Mũi - Họng
        "viêm tai", "viêm xoang", "viêm họng", "viêm amidan",
        "viêm thanh quản", "viêm mũi", "viêm VA",
        "polyp mũi", "polyp dây thanh",
        "lệch vách ngăn mũi",
        "áp xe họng", "áp xe quanh amidan", "áp xe mũi",
        "ù tai", "lão thính",
        "mất thính lực", "điếc",
        "ráy tai", "dị vật trong tai", "dị vật trong cổ họng",
        "thủng màng nhĩ", "tổn thương màng nhĩ",
        "viêm mê cung", "viêm xương chũm",
        "rối loạn chức năng ống eustachian",
        "hội chứng tiền đình",
        "khàn tiếng", "giọng khàn",
        "viêm amidan", "phì đại amidan",
        "tắc mũi", "nghẹt mũi",
        "sổ mũi", "chảy máu cam",
        "ngáy", "ngưng thở khi ngủ do tắc nghẽn",
        "rối loạn mũi",
        "bệnh meniere",
    ],
    "VII": [  # Tuần hoàn
        "suy tim", "đau tim", "nhồi máu cơ tim",
        "đau thắt ngực", "bệnh tim",
        "rối loạn nhịp tim", "rung nhĩ", "cuồng nhĩ",
        "nhịp nhanh", "nhịp chậm",
        "tăng huyết áp", "hạ huyết áp",
        "xơ vữa động mạch",
        "bệnh cơ tim",
        "bệnh van", "van hai lá", "van động mạch chủ",
        "phình động mạch chủ",
        "giãn tĩnh mạch", "suy tĩnh mạch",
        "huyết khối tĩnh mạch sâu",
        "thuyên tắc phổi", "thuyên tắc động mạch",
        "viêm tĩnh mạch huyết khối",
        "viêm nội tâm mạc", "viêm màng ngoài tim",
        "bệnh động mạch ngoại biên",
        "co thắt tâm nhĩ sớm", "co thắt tâm thất sớm",
        "hội chứng bệnh xoang",
        "bệnh tim tăng huyết áp",
        "bệnh van hai lá",
        "bệnh van động mạch chủ",
        "hội chứng lối thoát ngực",
        "bệnh động mạch vành",
        "giảm thể tích tuần hoàn",
        "suy tĩnh mạch mãn tính",
        "phù bạch huyết",
        "tim ngừng đập",
        "quá tải chất lỏng",
    ],
    "VIII": [  # Hô hấp
        "hen suyễn", "bệnh hen suyễn",
        "copd", "bệnh phổi tắc nghẽn mãn tính",
        "viêm phổi", "viêm phế quản", "viêm tiểu phế quản",
        "viêm khí quản",
        "viêm thanh khí phế quản (bệnh croup)",
        "tràn dịch màng phổi", "tràn khí màng phổi",
        "xẹp phổi", "xơ phổi",
        "bệnh phổi kẽ", "tăng bạch cầu ái toan ở phổi",
        "ngưng thở khi ngủ", "osa",
        "tắc nghẽn phổi", "tăng huyết áp động mạch phổi",
        "ards", "hội chứng suy hô hấp cấp tính",
        "suy hô hấp", "sự xẹp phổi",
        "viêm màng phổi",
        "ho ra máu", "ho ra đờm",
        "bệnh phổi",
        "tắc nghẽn ở ngực",
        "co thắt phế quản cấp tính",
    ],
    "IX": [  # Tiêu hóa
        "viêm dạ dày", "loét dạ dày", "đau dạ dày",
        "trào ngược dạ dày", "gerd",
        "viêm thực quản", "hẹp thực quản",
        "viêm ruột thừa",
        "viêm đại tràng", "bệnh crohn",
        "viêm loét đại tràng",
        "hội chứng ruột kích thích",
        "táo bón", "tiêu chảy",
        "bệnh trĩ", "nứt hậu môn", "rò hậu môn",
        "viêm túi thừa", "bệnh túi thừa",
        "thoát vị bẹn", "thoát vị bụng",
        "thoát vị khe thực quản",
        "sỏi mật", "bệnh sỏi đường mật",
        "viêm túi mật", "viêm đường mật tăng dần",
        "viêm tụy",
        "viêm gan", "xơ gan",
        "bệnh gan", "gan nhiễm mỡ",
        "sâu răng", "áp xe răng",
        "viêm nướu", "bệnh về nướu", "chảy máu nướu",
        "rối loạn răng", "gãy răng",
        "viêm tuyến nước bọt", "rối loạn tuyến nước bọt",
        "rối loạn hàm", "rối loạn khớp thái dương hàm",
        "chứng khó tiêu",
        "bệnh đường ruột", "liệt ruột", "tắc ruột",
        "xuất huyết đường tiêu hóa",
        "polyp đại tràng",
        "kém hấp thu ở ruột",
        "viêm phúc mạc",
        "dị vật trong đường tiêu hóa",
        "hội chứng ruột",
        "bệnh trào ngược dạ dày thực quản",
        "tổn thương niêm mạc miệng",
        "loét áp tơ",
        "viêm mô tế bào hoặc áp xe miệng",
        "bệnh đường ruột",
    ],
    "X": [  # Da & mô dưới da
        "viêm da", "chàm", "vẩy nến", "vảy nến",
        "bệnh vẩy nến", "bệnh vảy phấn hồng",
        "mụn trứng cá", "mụn nhọt",
        "bệnh trứng cá đỏ",
        "bệnh chàm", "viêm da tiếp xúc",
        "viêm da tiết bã", "viêm da do",
        "bệnh da", "bệnh ngoài da",
        "ngứa", "phát ban",
        "rụng tóc", "bệnh trichosis",
        "bệnh bạch biến",
        "viêm hidraden mủ",
        "dày sừng", "sừng hóa",
        "mô sẹo", "vết sẹo",
        "hăm tã", "intertrigo",
        "paronychia", "móng chân mọc ngược",
        "nấm da", "nấm tóc", "nấm kẽ chân",
        "bệnh nấm móng",
        "bệnh ghẻ", "chí", "côn trùng cắn",
        "mụn cóc", "u mềm lây",
        "bệnh da teo", "tình trạng da teo",
        "rối loạn sắc tố da",
        "rối loạn da",
        "polyp da", "u mỡ", "u mạch máu",
        "u nang bã nhờn",
        "bệnh chốc lở",
        "da khô", "nếp nhăn trên da",
        "mụn cóc", "chai chân",
        "bệnh da teo",
        "lichen đơn dạng mạn tính",
        "xơ cứng bì",
    ],
    "XI": [  # Cơ xương khớp & mô liên kết
        "viêm khớp", "thoái hóa khớp",
        "viêm cột sống", "viêm cột sống dính khớp",
        "đau lưng", "đau lưng dưới",
        "thoát vị đĩa đệm", "thoái hóa đĩa đệm",
        "viêm cơ", "viêm gân", "viêm bao hoạt dịch",
        "viêm cân gan chân",
        "bong gân", "căng cơ",
        "trật khớp",
        "gai xương",
        "hội chứng ống cổ tay",
        "viêm tủy xương",
        "hẹp cột sống", "trượt đốt sống",
        "vẹo cột sống", "chứng vẹo cột sống",
        "viêm mỏm lồi cầu",
        "bệnh de quervain",
        "đau xơ cơ",
        "viêm khớp dạng thấp",
        "lupus ban đỏ hệ thống",
        "viêm mạch máu",
        "hội chứng tietze",
        "chứng đau thắt lưng",
        "bệnh thoái hóa đĩa đệm",
        "viêm bao khớp vai",
        "rách dây chằng đầu gối",
        "nhuyễn sụn xương bánh chè",
        "hội chứng đau vùng phức hợp",
        "chấn thương chóp xoay",
        "bệnh xơ cứng bì",
        "viêm xương khớp",
        "tràn dịch khớp",
        "đau vai", "đau cổ", "đau đầu gối",
        "cứng khớp",
    ],
    "XII": [  # Tiết niệu - Sinh dục
        "viêm bàng quang", "bàng quang",
        "viêm niệu đạo", "hẹp niệu đạo",
        "sỏi thận", "sỏi tiết niệu",
        "viêm cầu thận", "viêm thận",
        "suy thận", "bệnh thận",
        "nhiễm trùng đường tiết niệu",
        "viêm tuyến tiền liệt",
        "tăng sản tuyến tiền liệt",
        "ung thư tuyến tiền liệt",
        "u xơ tử cung",
        "u nang buồng trứng",
        "lạc nội mạc tử cung",
        "viêm cổ tử cung", "rối loạn cổ tử cung",
        "viêm âm đạo", "viêm teo âm đạo",
        "rối loạn kinh nguyệt", "chu kỳ kinh nguyệt",
        "vô sinh", "vô kinh",
        "rối loạn cương dương", "xuất tinh sớm",
        "viêm mào tinh hoàn",
        "xoắn tinh hoàn", "thủy tinh hoàn",
        "hẹp bao quy đầu", "viêm quy đầu",
        "bệnh peyronie",
        "rối loạn tinh hoàn",
        "rối loạn âm hộ",
        "sa cơ quan vùng chậu",
        "varicocele", "giãn tĩnh mạch tinh",
        "u nang mào tinh",
        "tăng sản nội mạc tử cung",
        "tắc nghẽn đường tiết niệu",
        "rối loạn bàng quang",
        "suy buồng trứng sớm",
        "bệnh thận đa nang",
        "bệnh thận nguyên phát",
        "thận ứ nước",
        "chấn thương thận cấp tính",
        "u nang thận lành tính",
        "bệnh thận mãn tính",
        "viêm bể thận",
        "sỏi thận",
        "rối loạn tiểu tiện",
        "bí tiểu", "đái dầm",
        "viêm vùng chậu",
        "rối loạn nội mạc tử cung",
    ],
    "XIII": [  # Chấn thương, ngộ độc, tai nạn
        "gãy xương", "gãy", "nứt xương",
        "chấn thương", "bỏng", "vết thương hở",
        "vết thương ở",
        "ngộ độc", "dị vật",
        "côn trùng cắn", "nọc độc",
        "kiệt sức vì nóng", "say nắng",
        "phản ứng thuốc", "tác dụng phụ",
        "khối máu tụ",
        "bầm tím",
        "rắn cắn",
        "tổn thương nội tạng",
        "đau sau phẫu thuật",
        "nhiễm trùng sau phẫu thuật",
        "loét tư thế nằm",
    ],
}

# Refined override for "gãy" - it should go to XI (musculoskeletal) not XIII
# Actually "gãy xương" = fracture → XIII (trauma). Keep it in XIII.
# But "gãy răng" → IX (dental). Handle via exact map.
# "gãy" is in XIII but let's add exceptions


def classify(ten_benh: str) -> str:
    ten = ten_benh.lower().strip()
    
    # 1. Check exact map
    if ten in EXACT_MAP:
        return EXACT_MAP[ten]
    
    # 2. Check keyword rules in order
    for group_id in ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"]:
        for kw in KEYWORD_RULES.get(group_id, []):
            if kw in ten:
                return group_id
    
    # 3. Default
    return "XIV"


def main():
    db = SessionLocal()
    
    rows = db.execute(text("SELECT ma_benh, ten_benh, ma_nhom_benh FROM dm_benh ORDER BY ten_benh")).fetchall()
    total = len(rows)
    updated = 0
    skipped = 0
    
    for row in rows:
        ma_benh, ten_benh, current_group = row
        new_group = classify(ten_benh)
        
        if current_group == new_group:
            skipped += 1
            continue
        
        db.execute(
            text("UPDATE dm_benh SET ma_nhom_benh = :group WHERE ma_benh = :id"),
            {"group": new_group, "id": ma_benh}
        )
        updated += 1
    
    db.commit()
    db.close()
    
    print(f"Total: {total}")
    print(f"Updated: {updated}")
    print(f"Skipped (already correct): {skipped}")
    
    # Show summary by group
    print("\n--- Summary ---")
    db = SessionLocal()
    rows = db.execute(
        text("SELECT nb.ma_nhom, nb.ten_nhom, COUNT(d.ma_benh) "
             "FROM dm_nhom_benh nb LEFT JOIN dm_benh d ON nb.ma_nhom = d.ma_nhom_benh "
             "GROUP BY nb.ma_nhom, nb.ten_nhom ORDER BY nb.ma_nhom")
    ).fetchall()
    for r in rows:
        print(f"  {r[0]}: {r[1]} = {r[2]} bệnh")
    # Count unclassified
    unclassified = db.execute(text("SELECT COUNT(*) FROM dm_benh WHERE ma_nhom_benh IS NULL")).scalar()
    print(f"\n  XIV (Khác): {(db.execute(text('SELECT COUNT(*) FROM dm_benh WHERE ma_nhom_benh = :g'), {'g': 'XIV'}).scalar() or 0) + unclassified} bệnh (gồm {unclassified} chưa phân loại)")
    db.close()


if __name__ == "__main__":
    main()
