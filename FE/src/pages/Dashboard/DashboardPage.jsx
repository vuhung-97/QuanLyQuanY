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
    LocalHospital as LocalHospitalIcon,
    KeyboardArrowDown as ArrowDownIcon,
    Description as DescriptionIcon,
    AddBox as AddBoxIcon,
    CallMade as CallMadeIcon,
} from "@mui/icons-material";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";

// Mock Data
const stats = [
    {
        title1: "Tổng quan",
        title2: "số quản lý",
        value: "68,432",
        trend: "13.9%",
        icon: <PeopleAltIcon sx={{ color: "#00B4D8" }} />,
        bgColor: "rgba(0, 180, 216, 0.1)",
    },
    {
        title1: "Bộ đội đang",
        title2: "điều trị",
        value: "118",
        trend: "89%",
        icon: <MedicalServicesIcon sx={{ color: "#F59E0B" }} />,
        bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
        title1: "Quân nhân",
        title2: "nội trú",
        value: "24",
        trend: "2,4%",
        icon: <DomainIcon sx={{ color: "#3B82F6" }} />,
        bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
        title1: "Nhân viên",
        title2: "quân y",
        value: "450",
        trend: "50%",
        icon: <LocalHospitalIcon sx={{ color: "#0EA5E9" }} />,
        bgColor: "rgba(14, 165, 233, 0.1)",
    },
];

const chartData = [
    { name: "1 Oct", blue: 10, teal: 5 },
    { name: "3 Oct", blue: 25, teal: 18 },
    { name: "5 Oct", blue: 15, teal: 28 },
    { name: "7 Oct", blue: 30, teal: 25 },
    { name: "9 Oct", blue: 20, teal: 48 },
    { name: "11 Oct", blue: 35, teal: 25 },
    { name: "14 Oct", blue: 20, teal: 42 },
    { name: "17 Oct", blue: 40, teal: 30 },
    { name: "19 Oct", blue: 22, teal: 18 },
    { name: "25 Oct", blue: 25, teal: 45 },
    { name: "27 Oct", blue: 42, teal: 45 },
    { name: "29 Oct", blue: 22, teal: 32 },
    { name: "31 Oct", blue: 48, teal: 40 },
];

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

export default function DashboardPage() {
    return (
        <Stack spacing={3}>
            {/* Top Widgets */}
            <Grid container spacing={2.5}>
                {stats.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                                    sx={{ mb: 2, alignItems: "flex-start" }}
                                >
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            bgcolor: stat.bgColor,
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                            sx={{
                                                lineHeight: 1.2,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {stat.title1}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                            sx={{
                                                lineHeight: 1.2,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {stat.title2}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack
                                    direction="row"
                                    sx={{
                                        alignItems: "baseline",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{ color: "#1E293B" }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <CallMadeIcon
                                            sx={{
                                                fontSize: 14,
                                                color: "#10B981",
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{ color: "#10B981" }}
                                        >
                                            {stat.trend}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Area Chart */}
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                    overflow: "visible",
                }}
            >
                <CardContent sx={{ p: "24px !important" }}>
                    <Stack
                        direction="row"
                        sx={{
                            mb: 4,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ color: "#1E293B" }}
                        >
                            Xu hướng bệnh tật & sức khỏe bộ đội
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="text"
                                color="inherit"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                }}
                            >
                                Xu hướng bệnh tật đội
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                endIcon={<ArrowDownIcon />}
                                sx={{
                                    borderColor: "rgba(0,0,0,0.1)",
                                    color: "text.primary",
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                            >
                                01 Th01 - 31 Th12
                            </Button>
                        </Stack>
                    </Stack>
                    <Box sx={{ height: 320, width: "100%", minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 0,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTeal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#00B4D8"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#00B4D8"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorBlue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#0B3B60"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#0B3B60"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#F1F5F9"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 12 }}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "none",
                                        boxShadow:
                                            "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="teal"
                                    stroke="#00B4D8"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTeal)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="blue"
                                    stroke="#0B3B60"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBlue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>

            {/* Bottom Row */}
            <Grid container spacing={2.5}>
                {/* Table */}
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

                {/* Reports List */}
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
