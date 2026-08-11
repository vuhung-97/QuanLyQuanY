import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    AddPhotoAlternate as AddPhotoIcon,
    DeleteOutlineOutlined as DeleteIcon,
    OpenInNew as OpenInNewIcon,
    PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";
import useFormTab from "@/hooks/useFormTab";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import NormalToggleFieldSM from "../common/NormalToggleFieldSM.jsx";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";

const cdhaFields = [
    { name: "dien_tim", label: "Điện tim (ECG)" },
    { name: "x_quang", label: "X-Quang tim phổi" },
    { name: "sieu_am", label: "Siêu âm ổ bụng" },
    { name: "khac", label: "Cận lâm sàng khác" },
];

const ANH_KEYS = cdhaFields.map((f) => `${f.name}_anh`);

const isPdfUrl = (url) => /\.pdf$/i.test(url || "");

function collectImages(initialData) {
    const imgs = {};
    for (const key of ANH_KEYS) {
        imgs[key] = initialData?.[key] || "";
    }
    return imgs;
}

const fileNameFromUrl = (url) => (url || "").split("/").pop() || "";

const ChanDoanHinhAnhTab = memo(
    forwardRef(function ChanDoanHinhAnhTab(
        { initialData, cardStyle, readOnly = false, nam },
        ref,
    ) {
        const { dataRef } = useFormTab(initialData, ref);
        const fileInputRef = useRef(null);
        const [activeKey, setActiveKey] = useState(cdhaFields[0].name);
        const [images, setImages] = useState(() => collectImages(initialData));
        const [classifications, setClassifications] = useState(() => {
            const result = {};
            cdhaFields.forEach((f) => {
                result[`${f.name}_loai`] =
                    initialData?.[`${f.name}_loai`] || "Loại 1";
            });
            return result;
        });
        const [uploading, setUploading] = useState(false);
        const [error, setError] = useState("");
        const [preview, setPreview] = useState(null);

        useEffect(() => {
            setImages(collectImages(initialData));
            setClassifications(() => {
                const result = {};
                cdhaFields.forEach((f) => {
                    result[`${f.name}_loai`] =
                        initialData?.[`${f.name}_loai`] || "Loại 1";
                });
                return result;
            });
        }, [initialData]);

        const activeImgKey = `${activeKey}_anh`;
        const activeImg = images[activeImgKey] || "";

        const handleUpload = useCallback(
            async (file) => {
                setError("");
                if (!file) return;
                if (!nam) {
                    setError(
                        "Chưa có lịch khám để gom ảnh. Không thể lưu ảnh.",
                    );
                    return;
                }
                setUploading(true);
                try {
                    const oldPath = dataRef.current[activeImgKey];
                    if (oldPath) {
                        khamSucKhoeService.deleteCdha(oldPath).catch(() => {});
                    }
                    const res = await khamSucKhoeService.uploadCdha(nam, file);
                    const url = res.data.url;
                    dataRef.current[activeImgKey] = url;
                    setImages((prev) => ({ ...prev, [activeImgKey]: url }));
                } catch (err) {
                    setError(
                        err?.response?.data?.detail ||
                            err?.message ||
                            "Không thể tải file lên.",
                    );
                } finally {
                    setUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            },
            [nam, activeImgKey, dataRef],
        );

        const handleChooseFile = useCallback(
            (e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
            },
            [handleUpload],
        );

        const handleRemove = useCallback(() => {
            setError("");
            const path = dataRef.current[activeImgKey];
            if (path) khamSucKhoeService.deleteCdha(path).catch(() => {});
            dataRef.current[activeImgKey] = "";
            setImages((prev) => ({ ...prev, [activeImgKey]: "" }));
        }, [activeImgKey, dataRef]);

        const uploadDisabled = readOnly || uploading || !nam;

        return (
            <>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp,application/pdf,.pdf"
                    style={{ display: "none" }}
                    onChange={handleChooseFile}
                />

                <Grid container spacing={2.5}>
                    {/* Left Column: Vertical Tabs */}
                    <Grid size={{ xs: 12, md: 3.5 }}>
                        <Card sx={cardStyle}>
                            <CardContent sx={{ p: 2 }}>
                                <SectionTitle>Danh sách chỉ định</SectionTitle>
                                <Stack spacing={1} sx={{ mt: 1.5 }}>
                                    {cdhaFields.map((f) => {
                                        const hasFile =
                                            !!images[`${f.name}_anh`];
                                        const active = activeKey === f.name;
                                        const loai =
                                            classifications[`${f.name}_loai`] ||
                                            "Loại 1";
                                        return (
                                            <Box
                                                key={f.name}
                                                onClick={() =>
                                                    setActiveKey(f.name)
                                                }
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    bgcolor: active
                                                        ? "primary.light"
                                                        : "transparent",
                                                    color: active
                                                        ? "primary.contrastText"
                                                        : "text.primary",
                                                    "&:hover": {
                                                        bgcolor: active
                                                            ? "primary.light"
                                                            : "action.hover",
                                                    },
                                                    border: "1px solid",
                                                    borderColor: active
                                                        ? "primary.main"
                                                        : "divider",
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1.2}
                                                    sx={{
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: "50%",
                                                            bgcolor: hasFile
                                                                ? "success.main"
                                                                : "grey.400",
                                                            border: "1px solid",
                                                            borderColor: active
                                                                ? "primary.contrastText"
                                                                : "transparent",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={
                                                            active ? 600 : 500
                                                        }
                                                    >
                                                        {f.label}
                                                    </Typography>
                                                </Stack>
                                                <Chip
                                                    label={loai}
                                                    size="small"
                                                    color={
                                                        active
                                                            ? "default"
                                                            : "primary"
                                                    }
                                                    variant={
                                                        active
                                                            ? "filled"
                                                            : "outlined"
                                                    }
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: "0.72rem",
                                                        height: 20,
                                                        bgcolor: active
                                                            ? "background.paper"
                                                            : undefined,
                                                        color: active
                                                            ? "primary.main"
                                                            : undefined,
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column: Detail Content */}
                    <Grid size={{ xs: 12, md: 8.5 }}>
                        {cdhaFields.map((f) => {
                            if (activeKey !== f.name) return null;
                            return (
                                <Card key={f.name} sx={cardStyle}>
                                    <CardContent>
                                        <SectionTitle>{f.label}</SectionTitle>
                                        <Grid
                                            container
                                            spacing={3}
                                            sx={{ mt: 0.5 }}
                                        >
                                            {/* Form Input Side */}
                                            <Grid size={{ xs: 12, sm: 7 }}>
                                                <Stack spacing={2.5}>
                                                    <NormalToggleFieldSM
                                                        name={f.name}
                                                        label={`Kết quả ${f.label}`}
                                                        dataRef={dataRef}
                                                        readOnly={readOnly}
                                                        multiline
                                                        grid={12}
                                                        minRows={4}
                                                        maxRows={8}
                                                    />
                                                    <PhanLoaiSelect
                                                        name={`${f.name}_loai`}
                                                        label={`Phân loại ${f.label}`}
                                                        dataRef={dataRef}
                                                        readOnly={readOnly}
                                                        gridProps={false}
                                                        onChange={(val) => {
                                                            setClassifications(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [`${f.name}_loai`]:
                                                                        val,
                                                                }),
                                                            );
                                                        }}
                                                    />
                                                </Stack>
                                            </Grid>

                                            {/* Image Upload/Preview Side */}
                                            <Grid size={{ xs: 12, sm: 5 }}>
                                                {activeImg ? (
                                                    <Box
                                                        sx={{
                                                            border: "1px solid",
                                                            borderColor:
                                                                "divider",
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            bgcolor:
                                                                "background.default",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                        }}
                                                    >
                                                        <Box
                                                            onClick={() =>
                                                                setPreview({
                                                                    url: activeImg,
                                                                })
                                                            }
                                                            sx={{
                                                                height: 220,
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                cursor: "pointer",
                                                                "&:hover": {
                                                                    bgcolor:
                                                                        "action.hover",
                                                                },
                                                            }}
                                                        >
                                                            {isPdfUrl(
                                                                activeImg,
                                                            ) ? (
                                                                <Stack
                                                                    spacing={1}
                                                                    sx={{
                                                                        alignItems:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <PictureAsPdfIcon
                                                                        color="error"
                                                                        sx={{
                                                                            fontSize: 48,
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="caption"
                                                                        noWrap
                                                                        sx={{
                                                                            maxWidth: 160,
                                                                        }}
                                                                    >
                                                                        {fileNameFromUrl(
                                                                            activeImg,
                                                                        )}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        Bấm để
                                                                        xem PDF
                                                                    </Typography>
                                                                </Stack>
                                                            ) : (
                                                                <Box
                                                                    component="img"
                                                                    src={
                                                                        activeImg
                                                                    }
                                                                    alt={
                                                                        f.label
                                                                    }
                                                                    sx={{
                                                                        maxWidth:
                                                                            "100%",
                                                                        maxHeight: 220,
                                                                        objectFit:
                                                                            "contain",
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            sx={{
                                                                p: 1,
                                                                borderTop:
                                                                    "1px solid",
                                                                borderColor:
                                                                    "divider",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={
                                                                    <AddPhotoIcon />
                                                                }
                                                                onClick={() =>
                                                                    fileInputRef.current?.click()
                                                                }
                                                                disabled={
                                                                    uploadDisabled
                                                                }
                                                            >
                                                                Thay thế
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                                startIcon={
                                                                    <DeleteIcon />
                                                                }
                                                                onClick={
                                                                    handleRemove
                                                                }
                                                                disabled={
                                                                    uploadDisabled
                                                                }
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </Stack>
                                                    </Box>
                                                ) : (
                                                    <Paper
                                                        variant="outlined"
                                                        onClick={() =>
                                                            !uploadDisabled &&
                                                            fileInputRef.current?.click()
                                                        }
                                                        sx={{
                                                            border: "2px dashed",
                                                            borderColor:
                                                                uploadDisabled
                                                                    ? "grey.300"
                                                                    : "primary.light",
                                                            borderRadius: 2,
                                                            height: 220,
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            p: 2,
                                                            textAlign: "center",
                                                            cursor: uploadDisabled
                                                                ? "not-allowed"
                                                                : "pointer",
                                                            bgcolor:
                                                                "background.default",
                                                            "&:hover":
                                                                uploadDisabled
                                                                    ? undefined
                                                                    : {
                                                                          borderColor:
                                                                              "primary.main",
                                                                          bgcolor:
                                                                              "action.hover",
                                                                      },
                                                        }}
                                                    >
                                                        {uploading ? (
                                                            <CircularProgress
                                                                size={32}
                                                            />
                                                        ) : (
                                                            <>
                                                                <AddPhotoIcon
                                                                    color={
                                                                        uploadDisabled
                                                                            ? "disabled"
                                                                            : "primary"
                                                                    }
                                                                    sx={{
                                                                        fontSize: 40,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                >
                                                                    Tải file lên
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    Ảnh hoặc PDF
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Paper>
                                                )}

                                                {error && (
                                                    <Typography
                                                        color="error"
                                                        variant="caption"
                                                        display="block"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {error}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Grid>
                </Grid>

                <Dialog
                    open={Boolean(preview)}
                    onClose={() => setPreview(null)}
                    fullWidth
                    maxWidth="lg"
                    slotProps={{
                        paper: {
                            sx: { bgcolor: (t) => t.palette.background.paper },
                        },
                    }}
                >
                    <DialogTitleWrapper wrap={false}>
                        Xem kết quả chẩn đoán hình ảnh
                    </DialogTitleWrapper>
                    <DialogContent dividers>
                        {preview && isPdfUrl(preview.url) ? (
                            <Stack spacing={1.5}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "70vh",
                                        border: 0,
                                    }}
                                >
                                    <iframe
                                        src={preview.url}
                                        title="PDF"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: 0,
                                        }}
                                    />
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<OpenInNewIcon />}
                                    href={preview.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Mở trong tab mới
                                </Button>
                            </Stack>
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                {preview && (
                                    <Box
                                        component="img"
                                        src={preview.url}
                                        alt="Chẩn đoán hình ảnh"
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: "75vh",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setPreview(null)}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }),
);

export default ChanDoanHinhAnhTab;
