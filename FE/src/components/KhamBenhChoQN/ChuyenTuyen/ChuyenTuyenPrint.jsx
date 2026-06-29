import { Box, Stack, Typography } from "@mui/material";
import { tinhTuoi } from "@/utils/date.js";

function FieldRow({ label, value }) {
    return (
        <Box
            spacing={2}
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "90%",
                mb: 1.5,
            }}
        >
            <Typography sx={{ whiteSpace: "nowrap", fontSize: 18 }}>
                <strong>{label}:</strong>&nbsp;
            </Typography>
            <Typography sx={{ flex: 1, fontSize: 18 }}>
                {value || " "}
            </Typography>
        </Box>
    );
}

function FieldBlock({ label, value }) {
    return (
        <Box
            spacing={2}
            sx={{
                mb: 1.5,
                width: "90%",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Typography sx={{ fontSize: 18, mb: 3 }}>
                <strong>{label}: </strong>&nbsp;
            </Typography>
            <Typography
                sx={{
                    flex: 1,
                    fontSize: 18,
                }}
            >
                {value || " "}
            </Typography>
        </Box>
    );
}

export default function ChuyenTuyenPrint({
    selectedExam,
    examDetail,
    tenBenhVien,
    yKienDeNghi,
}) {
    return (
        <Box
            className="print-layout"
            sx={{
                display: "none",
                "@media print": { display: "block" },
            }}
        >
            {/* ----- PAGE 1 ----- */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 18 }}>
                            VÙNG I HẢI QUÂN
                        </Typography>
                        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                            LỮ ĐOÀN 170
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: 700,
                        textAlign: "center",
                        textTransform: "uppercase",
                        mb: 2,
                    }}
                >
                    GIẤY GIỚI THIỆU
                </Typography>

                <Typography sx={{ fontSize: 18, mb: 2, textAlign: "center" }}>
                    Kính gửi:{" "}
                    {tenBenhVien ||
                        ".................................................."}
                </Typography>

                <FieldRow label="Họ và tên" value={selectedExam?.ho_ten} />
                <FieldRow
                    label="Tuổi"
                value={tinhTuoi(selectedExam?.ngay_sinh)}
                />
                <FieldRow label="Cấp bậc" value={selectedExam?.cap_bac} />
                <FieldRow label="Chức vụ" value={selectedExam?.chuc_vu} />
                <FieldRow label="Đơn vị" value={selectedExam?.ten_don_vi} />

                <FieldBlock
                    label="Triệu chứng"
                    value={examDetail?.trieu_chung}
                />
                <FieldBlock label="Chẩn đoán" value={examDetail?.chan_doan} />

                <FieldBlock label="Ý kiến đề nghị" value={yKienDeNghi} />

                <Box
                    sx={{
                        mt: "50px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 18 }}>
                            <strong>Bác sĩ</strong>
                        </Typography>
                        <Typography sx={{ fontSize: 18 }}>
                            (ký, ghi rõ họ tên)
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ----- PAGE 2 ----- */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    pt: 4,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Stack spacing={3}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography sx={{ mb: 0.5, fontSize: 18 }}>
                            <strong>Thời gian đến bệnh xá:</strong>
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 18,
                                borderBottom: "1px dotted #000",
                                width: "70%",
                            }}
                        >
                            {" "}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography sx={{ mb: 0.5, fontSize: 18 }}>
                            <strong>Chẩn đoán:</strong>
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 18,
                                borderBottom: "1px dotted #000",
                                width: "85%",
                            }}
                        >
                            {" "}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ mb: 0.5, fontSize: 18 }}>
                            <strong>Quyết định của y sinh:</strong>
                        </Typography>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Typography
                                key={i}
                                sx={{
                                    fontSize: 18,
                                    borderBottom: "1px dotted #000",
                                    width: "100%",
                                    my: 3,
                                }}
                            >
                                {" "}
                            </Typography>
                        ))}
                    </Box>
                </Stack>

                <Box
                    sx={{
                        mt: "50px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 18 }}>
                            <strong>Y sinh</strong>
                        </Typography>
                        <Typography sx={{ fontSize: 18 }}>
                            (ký, ghi rõ họ tên)
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
