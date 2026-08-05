import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { getCurrentUser } from "@/services/api.js";
import { ROLES } from "@/constants/roleConstants.js";
import { getScheduleStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";
import PendingIcon from "@mui/icons-material/Pending";

export default function DotKhamSucKhoeWidget() {
    const navigate = useNavigate();
    const role = useMemo(() => getCurrentUser()?.role, []);
    const [schedule, setSchedule] = useState(null);
    const [stats, setStats] = useState(null);
    const [myVaiTro, setMyVaiTro] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await khamSucKhoeService.getScheduleList();
                const list = Array.isArray(res.data) ? res.data : [];
                const active = list
                    .filter(
                        (s) =>
                            s.trang_thai === "da_duyet" &&
                            getScheduleStatus(s) === "Đang thực hiện",
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.thoi_gian_bat_dau) -
                            new Date(a.thoi_gian_bat_dau),
                    )[0];
                if (ignore) return;
                setSchedule(active || null);
                setMyVaiTro(null);
                if (active) {
                    setLoading(true);
                    try {
                        const st = await khamSucKhoeService.getScheduleStats(
                            active.ma_lich_kham,
                        );
                        if (!ignore) setStats(st.data);
                    } catch {
                        if (!ignore) setStats(null);
                    } finally {
                        if (!ignore) setLoading(false);
                    }
                    if (
                        role !== ROLES.ADMIN &&
                        role !== ROLES.CNQY
                    ) {
                        khamSucKhoeService
                            .getMyAssignment(active.ma_lich_kham)
                            .then((res) => {
                                if (!ignore)
                                    setMyVaiTro(res.data?.ma_vai_tro ?? null);
                            })
                            .catch(() => {
                                if (!ignore) setMyVaiTro(null);
                            });
                    }
                } else {
                    setStats(null);
                }
            } catch {
                if (!ignore) {
                    setSchedule(null);
                    setStats(null);
                }
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [role]);

    const canXemXetNghiem =
        role === ROLES.ADMIN ||
        role === ROLES.CNQY ||
        myVaiTro === "xet_nghiem";

    const items = useMemo(() => {
        if (!schedule || !stats) return [];
        const tongQuanSo = stats.tong_quan_so || 0;
        const daKham = stats.da_kham || 0;
        const daLayMau = stats.da_lay_mau || 0;
        const chuaKham = Math.max(
            0,
            (stats.da_lay_mau || 0) - (stats.dang_kham || 0) - (stats.da_kham || 0),
        );
        const chuaLayMau = Math.max(0, tongQuanSo - daLayMau);
        const phanTramDaKham =
            tongQuanSo > 0 ? Math.round((daKham / tongQuanSo) * 100) : 0;
        const phanTramChuaKham =
            tongQuanSo > 0 ? Math.round((chuaKham / tongQuanSo) * 100) : 0;
        const phanTramChuaLayMau =
            tongQuanSo > 0 ? Math.round((chuaLayMau / tongQuanSo) * 100) : 0;
        const result = [
            {
                label: "Tổng quân số đợt khám",
                value: tongQuanSo,
                color: "primary.main",
                bg: "rgba(11, 59, 96, 0.1)",
                icon: <GroupsIcon />,
                filterKey: "",
            },
            {
                label: "Đã khám",
                value: daKham,
                note: `${phanTramDaKham}% quân số đợt khám`,
                color: "success.main",
                bg: "rgba(16, 185, 129, 0.12)",
                icon: <CheckCircleIcon />,
                filterKey: "da_kham",
            },
            {
                label: "Chưa khám",
                value: chuaKham,
                note: `${phanTramChuaKham}% quân số đã lấy máu chưa khám`,
                color: "warning.main",
                bg: "rgba(245, 158, 11, 0.12)",
                icon: <PendingIcon />,
                filterKey: "da_lay_mau",
            },
        ];
        if (canXemXetNghiem) {
            result.push({
                label: "Chưa lấy máu xét nghiệm",
                value: chuaLayMau,
                note: `${phanTramChuaLayMau}% quân số chưa lấy máu`,
                color: "secondary.main",
                bg: "rgba(0, 180, 216, 0.12)",
                icon: <ScienceIcon />,
                filterKey: "chua_lay_mau",
            });
        }
        return result;
    }, [schedule, stats, canXemXetNghiem]);

    if (!schedule) return null;

    return (
        <div>
            <Typography
                variant="h4"
                sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
            >
                Đợt khám sức khỏe định kỳ đang diễn ra 
            </Typography>
            <StatCardGrid
                items={items}
                loading={loading}
                onCardClick={(key = "") =>
                    navigate(
                        `/kham-dinh-ky/kham-suc-khoe?schedule=${schedule.ma_lich_kham}&unit=__ALL__${
                            key ? `&status=${key}` : ""
                        }`,
                    )
                }
            />
        </div>
    );
}
