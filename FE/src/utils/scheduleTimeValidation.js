import dayjs from "dayjs";

export function addErr(e, field, msg) {
    e[field] = e[field] ? `${e[field]}; ${msg}` : msg;
}

function markOverlap(annotate, bdF, ktF, bdMsg, ktMsg) {
    annotate(bdF, bdMsg);
    annotate(ktF, ktMsg);
}

/**
 * Phát hiện và đánh dấu lỗi trùng khoảng thời gian giữa 2 khoảng (a và b).
 * `annotate(field, msg)` ghi lỗi vào 1 trường. Mỗi khoảng có { bd, kt, bdF, ktF }.
 * Hỗ trợ đầy đủ 4 trường hợp: cả 2 khoảng đầy đủ, hoặc khoảng kia chỉ có 1 đầu mút.
 */
export function applyOverlap(annotate, a, b, aOverB, bOverA) {
    const aBd = a.bd;
    const aKt = a.kt;
    const bBd = b.bd;
    const bKt = b.kt;

    if (aBd && aKt && bBd && bKt) {
        if (aBd.isBefore(bKt) && bBd.isBefore(aKt)) {
            markOverlap(annotate, a.bdF, a.ktF, aOverB, aOverB);
            markOverlap(annotate, b.bdF, b.ktF, bOverA, bOverA);
        }
        return;
    }

    if (aBd && aKt && bBd) {
        if ((bBd.isAfter(aBd) || bBd.isSame(aBd)) && bBd.isBefore(aKt)) {
            annotate(b.bdF, bOverA);
            annotate(a.bdF, aOverB);
            annotate(a.ktF, aOverB);
        }
    }
    if (aBd && aKt && bKt) {
        if (bKt.isAfter(aBd) && (bKt.isBefore(aKt) || bKt.isSame(aKt))) {
            annotate(b.ktF, bOverA);
            annotate(a.bdF, aOverB);
            annotate(a.ktF, aOverB);
        }
    }
    if (bBd && bKt && aBd) {
        if ((aBd.isAfter(bBd) || aBd.isSame(bBd)) && aBd.isBefore(bKt)) {
            annotate(a.bdF, aOverB);
            annotate(b.bdF, bOverA);
            annotate(b.ktF, bOverA);
        }
    }
    if (bBd && bKt && aKt) {
        if (aKt.isAfter(bBd) && (aKt.isBefore(bKt) || aKt.isSame(bKt))) {
            annotate(a.ktF, aOverB);
            annotate(b.bdF, bOverA);
            annotate(b.ktF, bOverA);
        }
    }
}

/**
 * Kiểm tra khoảng thời gian theo đơn vị (chỉ cần kết thúc > bắt đầu).
 */
export function detailRangeError(bdStr, ktStr, label) {
    if (!bdStr || !ktStr) return "";
    if (dayjs(ktStr).isBefore(dayjs(bdStr)) || dayjs(ktStr).isSame(bdStr)) {
        return `Thời gian kết thúc ${label} phải sau thời gian bắt đầu`;
    }
    return "";
}

/**
 * Kiểm tra ranh giới theo thời gian chính của lịch năm (theo đơn vị).
 */
export function detailBoundsError(valStr, masterBdStr, masterKtStr, label) {
    if (!valStr) return "";
    const val = dayjs(valStr);
    if (masterBdStr && val.isBefore(dayjs(masterBdStr))) {
        return `Không được trước thời gian bắt đầu ${label} của lịch năm`;
    }
    if (masterKtStr && val.isAfter(dayjs(masterKtStr))) {
        return `Không được sau thời gian kết thúc ${label} của lịch năm`;
    }
    return "";
}