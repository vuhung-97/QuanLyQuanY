import { Stack, Typography } from "@mui/material";
import {
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    HourglassTop as HourglassIcon,
    PendingActions as PendingIcon,
} from "@mui/icons-material";
import KetQuaKhamFilter from "./KetQuaKhamFilter.jsx";
import KetQuaKhamTienDo from "./KetQuaKhamTienDo.jsx";
import KetQuaKhamPhanLoai from "./KetQuaKhamPhanLoai.jsx";
import KetQuaKhamTheLuc from "./KetQuaKhamTheLuc.jsx";
import KetQuaKhamBenhTat from "./KetQuaKhamBenhTat.jsx";
import KetQuaKhamDonVi from "./KetQuaKhamDonVi.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";
import useKetQuaKham from "@/hooks/useKetQuaKham.jsx";

export default function KetQuaKhamMain() {
    const {
        nam, setNam,
        schedules,
        yearOptions,
        selectedSchedule,
        setSelectedSchedule,
        scheduleId,
        loading,
        error,
        stats,
        tienDo,
        phanBoPhanLoai,
        theLucTrungBinh,
        xetNghiemTrungBinh,
        benhTat,
        lamSangBatThuong,
        donViData,
        XN_FIELDS,
    } = useKetQuaKham();

    const tongQuanItems = stats
        ? [
              {
                  label: "Tổng quân số",
                  value: stats.tong_quan_so,
                  icon: <GroupsIcon />,
                  color: "#0B3B60",
                  bg: "rgba(11, 59, 96, 0.1)",
              },
              {
                  label: "Đã khám",
                  value: stats.da_kham,
                  icon: <CheckCircleIcon />,
                  color: "#10B981",
                  bg: "rgba(16, 185, 129, 0.1)",
              },
              {
                  label: "Đang khám",
                  value: stats.dang_kham,
                  icon: <HourglassIcon />,
                  color: "#F59E0B",
                  bg: "rgba(245, 158, 11, 0.1)",
              },
              {
                  label: "Chưa khám",
                  value: stats.con_lai,
                  icon: <PendingIcon />,
                  color: "#94A3B8",
                  bg: "rgba(148, 163, 184, 0.1)",
              },
          ]
        : [];

    return (
        <Stack spacing={3}>
            <KetQuaKhamFilter
                nam={nam}
                yearOptions={yearOptions}
                onNamChange={setNam}
                schedules={schedules}
                selectedSchedule={scheduleId}
                onChange={setSelectedSchedule}
                loading={loading}
            />

            <LoadingAlert
                loading={loading}
                error={error}
                empty={!stats}
                emptyMessage="Chọn đợt khám để xem tổng hợp kết quả."
            />

            {stats && (
                <>
                    <StatCardGrid items={tongQuanItems} />

                    <KetQuaKhamTienDo tienDo={tienDo} donViData={donViData} />

                    <KetQuaKhamPhanLoai
                        phanBoPhanLoai={phanBoPhanLoai}
                        lamSangBatThuong={lamSangBatThuong}
                    />

                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                        Thể lực trung bình
                    </Typography>
                    <KetQuaKhamTheLuc theLucTrungBinh={theLucTrungBinh} />

                    <KetQuaKhamBenhTat
                        benhTat={benhTat}
                        xetNghiemTrungBinh={xetNghiemTrungBinh}
                        XN_FIELDS={XN_FIELDS}
                    />

                    <KetQuaKhamDonVi phanBoPhanLoai={phanBoPhanLoai} />
                </>
            )}
        </Stack>
    );
}
