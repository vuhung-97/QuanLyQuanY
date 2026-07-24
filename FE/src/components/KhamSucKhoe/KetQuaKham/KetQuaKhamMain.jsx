import { Stack, Typography } from "@mui/material";
import {
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    HourglassTop as HourglassIcon,
    PendingActions as PendingIcon,
} from "@mui/icons-material";
import KetQuaKhamFilter from "./KetQuaKhamFilter.jsx";
import KetQuaKhamSection1 from "./KetQuaKhamSection1.jsx";
import KetQuaKhamLamSangBenh from "./KetQuaKhamLamSangBenh.jsx";
import KetQuaKhamTheLuc from "./KetQuaKhamTheLuc.jsx";
import KetQuaKhamBenhTat from "./KetQuaKhamBenhTat.jsx";
import KetQuaKhamSection5 from "./KetQuaKhamSection5.jsx";
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
        soldiers,
        phieuMap,
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

                    <KetQuaKhamSection1 tienDo={tienDo} phanBoPhanLoai={phanBoPhanLoai} />

                    <KetQuaKhamLamSangBenh
                        lamSangBatThuong={lamSangBatThuong}
                        benhTat={benhTat}
                        soldiers={soldiers}
                        phieuMap={phieuMap}
                        maLichKham={scheduleId}
                        nam={nam}
                        stats={stats}
                    />

                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                        Thể lực trung bình
                    </Typography>
                    <KetQuaKhamTheLuc theLucTrungBinh={theLucTrungBinh} />

                    <KetQuaKhamBenhTat xetNghiemTrungBinh={xetNghiemTrungBinh} />

                    <KetQuaKhamSection5
                        phanBoPhanLoai={phanBoPhanLoai}
                        soldiers={soldiers}
                        phieuMap={phieuMap}
                        maLichKham={scheduleId}
                        nam={nam}
                        stats={stats}
                    />
                </>
            )}
        </Stack>
    );
}
