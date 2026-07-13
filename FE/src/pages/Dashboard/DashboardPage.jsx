import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";
import {
    PeopleAlt as PeopleAltIcon,
    MedicalServices as MedicalServicesIcon,
    Domain as DomainIcon,
    Description as DescriptionIcon,
    AddBox as AddBoxIcon,
    Bed as BedIcon,
    Healing as HealingIcon,
} from "@mui/icons-material";
import api from "@/services/api.js";
import ChartQuanSoKhamChuaBenh from "@/components/Dashboard/ChartQuanSoKhamChuaBenh.jsx";

const tableData = [
    {
        id: "0001E38",
        name: "Quân nhân",
        dept: "Viện Y",
        doctor: "Bác sĩ",
        status: "Đã khám",
        time: "28 day ngo",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: "0001E39",
        name: "Tran Van B",
        dept: "Khám Bên",
        doctor: "Dr. Kuyen",
        status: "Chờ khám",
        time: "28 day ngo",
        avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
        id: "0001E39",
        name: "Dr. Nguyễn",
        dept: "Viện Y",
        doctor: "Bác sĩ",
        status: "Đã khám",
        time: "28 day ngo",
        avatar: "https://i.pravatar.cc/150?img=14",
    },
];

const reports = [
    {
        title: "Báo cáo sức khỏe định kỳ năm",
        icon: <DescriptionIcon sx={{ color: "#3B82F6" }} />,
    },
    {
        title: "Thống kê quân nhân nội trú",
        icon: <AddBoxIcon sx={{ color: "#3B82F6" }} />,
    },
    {
        title: "Báo cáo tình hình dịch tễ\nBáo cáo tồn kho dược",
        icon: <DescriptionIcon sx={{ color: "#3B82F6" }} />,
    },
];

const statMeta = [
    {
        key: "tong_quan_so",
        label: "Tổng quân số",
        icon: <PeopleAltIcon sx={{ color: "#0B3B60" }} />,
        bg: "rgba(11, 59, 96, 0.1)",
    },
    {
        key: "luot_kham",
        label: "Lượt khám trong ngày",
        icon: <MedicalServicesIcon sx={{ color: "#00B4D8" }} />,
        bg: "rgba(0, 180, 216, 0.1)",
    },
    {
        key: "noi_tru",
        label: "Đang nội trú",
        icon: <DomainIcon sx={{ color: "#3B82F6" }} />,
        bg: "rgba(59, 130, 246, 0.1)",
    },
    {
        key: "chuyen_tuyen",
        label: "Đang chuyển tuyến",
        icon: <HealingIcon sx={{ color: "#F59E0B" }} />,
        bg: "rgba(245, 158, 11, 0.1)",
    },
    {
        key: "don_thuoc",
        label: "Đơn thuốc đã kê trong ngày",
        icon: <DescriptionIcon sx={{ color: "#10B981" }} />,
        bg: "rgba(16, 185, 129, 0.1)",
    },
    {
        key: "tong_giuong",
        label: "Tổng giường",
        icon: <BedIcon sx={{ color: "#8B5CF6" }} />,
        bg: "rgba(139, 92, 246, 0.1)",
    },
    {
        key: "giuong_trong",
        label: "Giường trống",
        icon: <BedIcon sx={{ color: "#EC4899" }} />,
        bg: "rgba(236, 72, 153, 0.1)",
    },
];

export default function DashboardPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get("/bao-cao/tong-quan")
            .then((res) => setStats(res.data))
            .catch(() => {});
    }, []);

    const flatStats = stats
        ? {
              luot_kham: stats.hom_nay.luot_kham,
              noi_tru: stats.hom_nay.noi_tru,
              chuyen_tuyen: stats.hom_nay.chuyen_tuyen,
              don_thuoc: stats.hom_nay.don_thuoc,
              tong_giuong: stats.tong_quan.tong_giuong,
              giuong_trong: stats.tong_quan.giuong_trong,
              tong_quan_so: stats.tong_quan.tong_quan_so,
          }
        : {};

    return (
        <Stack spacing={3}>
            {/* 7 Stat Cards */}
            <Grid container spacing={2.5}>
                {statMeta.map((m, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={m.key}>
                        <Card
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                            }}
                        >
                            <CardContent sx={{ p: "16px !important" }}>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    sx={{ mb: 1, alignItems: "flex-start" }}
                                >
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            bgcolor: m.bg,
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {m.icon}
                                    </Avatar>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {m.label}
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ color: "#1E293B", ml: 0.5 }}
                                >
                                    {flatStats[m.key] ?? "--"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <ChartQuanSoKhamChuaBenh />

            {/* Bottom Row */}
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                            height: "100%",
                        }}
                    >
                        <CardContent
                            sx={{ p: "24px !important", pb: "16px !important" }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ color: "#1E293B", mb: 2 }}
                            >
                                Danh sách khám bệnh gần đây
                            </Typography>
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 600 }}
                                    aria-label="recent patients table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    pl: 0,
                                                }}
                                            >
                                                Bệnh nhân
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                }}
                                            >
                                                Mã QN
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                }}
                                            >
                                                Khoa
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                }}
                                            >
                                                Bác sĩ
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                }}
                                            >
                                                Trạng thái
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    pr: 0,
                                                }}
                                            >
                                                Thời gian
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                        pl: 0,
                                                        py: 1.5,
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1.5}
                                                        sx={{
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={row.avatar}
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={500}
                                                            sx={{
                                                                color: "#334155",
                                                            }}
                                                        >
                                                            {row.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                        color: "#64748B",
                                                    }}
                                                >
                                                    {row.id}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                        color: "#64748B",
                                                    }}
                                                >
                                                    {row.dept}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                        color: "#64748B",
                                                    }}
                                                >
                                                    {row.doctor}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                    }}
                                                >
                                                    <Chip
                                                        label={row.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor:
                                                                row.status ===
                                                                "Đã khám"
                                                                    ? "rgba(0, 180, 216, 0.15)"
                                                                    : "rgba(245, 158, 11, 0.15)",
                                                            color:
                                                                row.status ===
                                                                "Đã khám"
                                                                    ? "#00B4D8"
                                                                    : "#F59E0B",
                                                            fontWeight: 600,
                                                            borderRadius: 1.5,
                                                            px: 0.5,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #F1F5F9",
                                                        color: "#64748B",
                                                        pr: 0,
                                                    }}
                                                >
                                                    {row.time}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: "24px !important" }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ color: "#1E293B", mb: 3 }}
                            >
                                Tổng quan báo cáo
                            </Typography>
                            <Stack spacing={3}>
                                {reports.map((report, idx) => (
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        key={idx}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                bgcolor:
                                                    "rgba(59, 130, 246, 0.1)",
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {report.icon}
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#334155",
                                                fontWeight: 500,
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {report.title}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
