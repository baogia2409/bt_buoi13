
const formatVND = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function layGiaTri(id) {
  return document.getElementById(id).value.trim();
}

// Các class Tailwind cho khung kết quả
const KET_QUA_CO_BAN = "mt-4 min-h-[48px] rounded-lg border border-dashed px-4 py-3 leading-relaxed ";
const KET_QUA_LOAI = {
  "": "border-slate-300 bg-slate-50",
  pass: "border-green-600 bg-green-50 text-green-800",
  fail: "border-red-500 bg-red-50 text-red-800",
};

function hienKetQua(id, noiDung, loai) {
  const ketQua = document.getElementById(id);
  ketQua.innerHTML = noiDung;
  ketQua.className = KET_QUA_CO_BAN + KET_QUA_LOAI[loai || ""];
}

// Chuyển tab Bài 1 - 4
const TAB_ACTIVE = ["bg-blue-600", "text-white"];
const TAB_INACTIVE = ["bg-slate-200", "text-slate-700"];

function showTab(soBai) {
  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById("bai" + i);
    const btn = document.getElementById("tabBtn" + i);
    const dangChon = i === soBai;
    card.classList.toggle("hidden", !dangChon);
    btn.classList.remove(...TAB_ACTIVE, ...TAB_INACTIVE);
    btn.classList.add(...(dangChon ? TAB_ACTIVE : TAB_INACTIVE));
  }
}

// ================== BÀI 1: QUẢN LÝ TUYỂN SINH ==================
function diemKhuVuc(khuVuc) {
  switch (khuVuc) {
    case "A": return 2;
    case "B": return 1;
    case "C": return 0.5;
    default: return 0; // X hoặc không thuộc khu vực ưu tiên
  }
}

function diemDoiTuong(doiTuong) {
  switch (doiTuong) {
    case "1": return 2.5;
    case "2": return 1.5;
    case "3": return 1;
    default: return 0; // 0 hoặc không thuộc đối tượng ưu tiên
  }
}

function tinhTuyenSinh() {
  const chuoiDiem = [layGiaTri("diemChuan"), layGiaTri("diemMon1"), layGiaTri("diemMon2"), layGiaTri("diemMon3")];
  if (chuoiDiem.includes("")) {
    hienKetQua("ketQuaBai1", "⚠️ Vui lòng nhập đầy đủ điểm chuẩn và điểm 3 môn!", "fail");
    return;
  }

  const diemChuan = Number(chuoiDiem[0]);
  const mon1 = Number(chuoiDiem[1]);
  const mon2 = Number(chuoiDiem[2]);
  const mon3 = Number(chuoiDiem[3]);

  if ([mon1, mon2, mon3].some((d) => d < 0 || d > 10) || diemChuan < 0) {
    hienKetQua("ketQuaBai1", "⚠️ Điểm mỗi môn phải từ 0 đến 10, điểm chuẩn không âm!", "fail");
    return;
  }

  const uuTien = diemKhuVuc(layGiaTri("khuVuc")) + diemDoiTuong(layGiaTri("doiTuong"));
  const tongDiem = mon1 + mon2 + mon3 + uuTien;

  // Có môn bị điểm 0 => rớt ngay, không cần xét tổng điểm
  if (mon1 === 0 || mon2 === 0 || mon3 === 0) {
    hienKetQua("ketQuaBai1",
      `❌ Bạn đã <b>RỚT</b> do có môn bị điểm 0.<br>Tổng điểm đạt được: <b>${tongDiem}</b>`, "fail");
    return;
  }

  if (tongDiem >= diemChuan) {
    hienKetQua("ketQuaBai1",
      `✅ Chúc mừng, bạn đã <b>ĐẬU</b>!<br>Tổng điểm đạt được: <b>${tongDiem}</b> (điểm ưu tiên: ${uuTien})`, "pass");
  } else {
    hienKetQua("ketQuaBai1",
      `❌ Rất tiếc, bạn đã <b>RỚT</b>.<br>Tổng điểm đạt được: <b>${tongDiem}</b> (điểm ưu tiên: ${uuTien}) &lt; điểm chuẩn ${diemChuan}`, "fail");
  }
}

// ================== BÀI 2: TÍNH TIỀN ĐIỆN ==================
function tinhTienDien() {
  const ten = layGiaTri("tenDien");
  const chuoiKw = layGiaTri("soKw");

  if (ten === "" || chuoiKw === "") {
    hienKetQua("ketQuaBai2", "⚠️ Vui lòng nhập tên và số kw!", "fail");
    return;
  }
  const soKw = Number(chuoiKw);
  if (soKw < 0) {
    hienKetQua("ketQuaBai2", "⚠️ Số kw không được âm!", "fail");
    return;
  }

  const GIA_50_DAU = 500;
  const GIA_50_KE = 650;
  const GIA_100_KE = 850;
  const GIA_150_KE = 1100;
  const GIA_CON_LAI = 1300;

  let tien = 0;
  if (soKw <= 50) {
    tien = soKw * GIA_50_DAU;
  } else if (soKw <= 100) {
    tien = 50 * GIA_50_DAU + (soKw - 50) * GIA_50_KE;
  } else if (soKw <= 200) {
    tien = 50 * GIA_50_DAU + 50 * GIA_50_KE + (soKw - 100) * GIA_100_KE;
  } else if (soKw <= 350) {
    tien = 50 * GIA_50_DAU + 50 * GIA_50_KE + 100 * GIA_100_KE + (soKw - 200) * GIA_150_KE;
  } else {
    tien = 50 * GIA_50_DAU + 50 * GIA_50_KE + 100 * GIA_100_KE + 150 * GIA_150_KE + (soKw - 350) * GIA_CON_LAI;
  }

  hienKetQua("ketQuaBai2",
    `👤 Khách hàng: <b>${ten}</b><br>⚡ Số điện tiêu thụ: <b>${soKw} kw</b><br>💵 Tiền điện phải trả: <b>${formatVND.format(tien)}</b>`);
}

// ================== BÀI 3: TÍNH THUẾ THU NHẬP CÁ NHÂN ==================
function tinhThue() {
  const hoTen = layGiaTri("hoTen");
  const chuoiThuNhap = layGiaTri("tongThuNhap");
  const chuoiPhuThuoc = layGiaTri("soNguoiPhuThuoc");

  if (hoTen === "" || chuoiThuNhap === "" || chuoiPhuThuoc === "") {
    hienKetQua("ketQuaBai3", "⚠️ Vui lòng nhập đầy đủ họ tên, tổng thu nhập năm và số người phụ thuộc!", "fail");
    return;
  }

  const tongThuNhap = Number(chuoiThuNhap);
  const soNguoiPhuThuoc = Number(chuoiPhuThuoc);
  if (tongThuNhap < 0 || soNguoiPhuThuoc < 0) {
    hienKetQua("ketQuaBai3", "⚠️ Thu nhập và số người phụ thuộc không được âm!", "fail");
    return;
  }

  // Thu nhập chịu thuế = Tổng thu nhập năm - 4tr - Số người phụ thuộc * 1.6tr
  const thuNhapChiuThue = tongThuNhap - 4e6 - soNguoiPhuThuoc * 1.6e6;

  if (thuNhapChiuThue <= 0) {
    hienKetQua("ketQuaBai3",
      `👤 <b>${hoTen}</b><br>Thu nhập chịu thuế: <b>${formatVND.format(Math.max(thuNhapChiuThue, 0))}</b><br>💰 Thuế phải trả: <b>${formatVND.format(0)}</b>`);
    return;
  }

  // Thuế lũy tiến từng đoạn: [mức trần của đoạn, thuế suất]
  const bacThue = [
    [60e6, 0.05],
    [120e6, 0.10],
    [210e6, 0.15],
    [384e6, 0.20],
    [624e6, 0.25],
    [960e6, 0.30],
    [Infinity, 0.35],
  ];

  let thue = 0;
  let mucTruoc = 0;
  for (let i = 0; i < bacThue.length; i++) {
    const tran = bacThue[i][0];
    const thueSuat = bacThue[i][1];
    if (thuNhapChiuThue > mucTruoc) {
      const phanChiuThue = Math.min(thuNhapChiuThue, tran) - mucTruoc;
      thue += phanChiuThue * thueSuat;
    }
    mucTruoc = tran;
  }

  hienKetQua("ketQuaBai3",
    `👤 Họ tên: <b>${hoTen}</b><br>` +
    `Thu nhập chịu thuế: <b>${formatVND.format(thuNhapChiuThue)}</b><br>` +
    `💰 Thuế thu nhập cá nhân phải trả: <b>${formatVND.format(thue)}</b>`);
}

// ================== BÀI 4: TÍNH TIỀN CÁP ==================
// Ẩn/hiện ô nhập số kết nối theo loại khách hàng (sự kiện onchange)
function anHienKetNoi() {
  const loai = layGiaTri("loaiKhachHang");
  const box = document.getElementById("boxKetNoi");
  if (loai === "doanhnghiep") {
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
    document.getElementById("soKetNoi").value = "";
  }
}

function tinhTienCap() {
  const maKH = layGiaTri("maKhachHang");
  const loai = layGiaTri("loaiKhachHang");
  const chuoiKenh = layGiaTri("soKenhCaoCap");

  if (maKH === "" || chuoiKenh === "") {
    hienKetQua("ketQuaBai4", "⚠️ Vui lòng nhập mã khách hàng và số kênh cao cấp!", "fail");
    return;
  }
  const soKenh = Number(chuoiKenh);
  if (soKenh < 0) {
    hienKetQua("ketQuaBai4", "⚠️ Số kênh không được âm!", "fail");
    return;
  }

  let tongTien = 0;
  let chiTiet = "";

  if (loai === "nhadan") {
    const phiXuLy = 4.5;
    const phiCoBan = 20.5;
    const phiKenh = 7.5 * soKenh;
    tongTien = phiXuLy + phiCoBan + phiKenh;
    chiTiet = `Phí xử lý hóa đơn: ${formatUSD.format(phiXuLy)}<br>` +
              `Phí dịch vụ cơ bản: ${formatUSD.format(phiCoBan)}<br>` +
              `Thuê ${soKenh} kênh cao cấp: ${formatUSD.format(phiKenh)}`;
  } else {
    const chuoiKetNoi = layGiaTri("soKetNoi");
    if (chuoiKetNoi === "") {
      hienKetQua("ketQuaBai4", "⚠️ Vui lòng nhập số kết nối!", "fail");
      return;
    }
    const soKetNoi = Number(chuoiKetNoi);
    if (soKetNoi < 0) {
      hienKetQua("ketQuaBai4", "⚠️ Số kết nối không được âm!", "fail");
      return;
    }

    const phiXuLy = 15;
    // 10 kết nối đầu: 75$ trọn gói, từ kết nối thứ 11 tính 5$/kết nối
    let phiCoBan = 75;
    if (soKetNoi > 10) {
      phiCoBan += (soKetNoi - 10) * 5;
    }
    const phiKenh = 50 * soKenh;
    tongTien = phiXuLy + phiCoBan + phiKenh;
    chiTiet = `Phí xử lý hóa đơn: ${formatUSD.format(phiXuLy)}<br>` +
              `Phí dịch vụ cơ bản (${soKetNoi} kết nối): ${formatUSD.format(phiCoBan)}<br>` +
              `Thuê ${soKenh} kênh cao cấp: ${formatUSD.format(phiKenh)}`;
  }

  hienKetQua("ketQuaBai4",
    `🆔 Mã khách hàng: <b>${maKH}</b> (${loai === "nhadan" ? "Nhà dân" : "Doanh nghiệp"})<br>` +
    `${chiTiet}<br>💵 Tổng tiền cáp: <b>${formatUSD.format(tongTien)}</b>`);
}

// Trạng thái ban đầu của Bài 4
anHienKetNoi();