import { TableCell, TableRow } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

export default function BackupTab({ backupFiles, loading, onDownload }) {
    return (
        <DataTable
            columns={[
                { key: "file_name", label: "File name" },
                { key: "kich_thuoc", label: "Kích thước" },
                { key: "ngay_tao", label: "Ngày tạo" },
                { key: "hanh_dong", label: "Hành động" },
            ]}
            loading={loading}
            emptyMessage="Chưa có file backup."
            minWidth={720}
        >
            {backupFiles.map((file) => (
                <TableRow key={file.filename} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                        {file.filename}
                    </TableCell>
                    <TableCell>
                        {(file.size / 1024).toFixed(1)} KB
                    </TableCell>
                    <TableCell>
                        {formatDateTime(file.modified)}
                    </TableCell>
                    <TableCell>
                        <ActionIcon
                            title="Tải về"
                            icon={<DownloadIcon />}
                            color="primary"
                            onClick={() => onDownload(file.filename)}
                        />
                    </TableCell>
                </TableRow>
            ))}
        </DataTable>
    );
}
