// Từ điển từ khóa (đã bỏ dấu, viết thường) để phân tích tin rao → điền form.
// Khớp theo dạng "chuỗi đã normalize CHỨA từ khóa". Key dài hơn được ưu tiên.

// Tên khu vực/phường phổ biến ở Hà Nội → slug quận/huyện.
export const AREA_ALIASES: Record<string, string> = {
  // Nam Từ Liêm
  "nam tu liem": "nam-tu-liem", "my dinh": "nam-tu-liem", "me tri": "nam-tu-liem",
  "phu do": "nam-tu-liem", "le duc tho": "nam-tu-liem", "tran huu duc": "nam-tu-liem",
  "ho tung mau": "nam-tu-liem", "keangnam": "nam-tu-liem",
  // Bắc Từ Liêm
  "bac tu liem": "bac-tu-liem", "co nhue": "bac-tu-liem", "xuan dinh": "bac-tu-liem",
  "dong ngac": "bac-tu-liem", "pham van dong": "bac-tu-liem", "duc thang": "bac-tu-liem",
  // Cầu Giấy
  "cau giay": "cau-giay", "dich vong": "cau-giay", "mai dich": "cau-giay",
  "nghia do": "cau-giay", "nghia tan": "cau-giay", "yen hoa": "cau-giay",
  "trung kinh": "cau-giay", "xuan thuy": "cau-giay", "tran thai tong": "cau-giay", "duy tan": "cau-giay",
  // Thanh Xuân
  "thanh xuan": "thanh-xuan", "khuong dinh": "thanh-xuan", "ha dinh": "thanh-xuan",
  "nhan chinh": "thanh-xuan", "kim giang": "thanh-xuan", "khuong trung": "thanh-xuan",
  "thuong dinh": "thanh-xuan", "royal city": "thanh-xuan", "nguyen trai": "thanh-xuan",
  // Đống Đa
  "dong da": "dong-da", "lang ha": "dong-da", "kham thien": "dong-da",
  "o cho dua": "dong-da", "ton duc thang": "dong-da", "chua boc": "dong-da",
  "thai ha": "dong-da", "xa dan": "dong-da", "ton that tung": "dong-da",
  // Hai Bà Trưng
  "hai ba trung": "hai-ba-trung", "bach mai": "hai-ba-trung", "minh khai": "hai-ba-trung",
  "times city": "hai-ba-trung", "vinh tuy": "hai-ba-trung", "tran khat chan": "hai-ba-trung",
  // Hoàng Mai
  "hoang mai": "hoang-mai", "dinh cong": "hoang-mai", "dai kim": "hoang-mai",
  "linh dam": "hoang-mai", "kim nguu": "hoang-mai", "tan mai": "hoang-mai",
  "giap bat": "hoang-mai", "phap van": "hoang-mai",
  // Hà Đông
  "ha dong": "ha-dong", "van quan": "ha-dong", "mo lao": "ha-dong", "la khe": "ha-dong",
  "duong noi": "ha-dong", "yen nghia": "ha-dong", "phu la": "ha-dong", "to huu": "ha-dong",
  // Long Biên
  "long bien": "long-bien", "ngoc lam": "long-bien", "sai dong": "long-bien",
  "viet hung": "long-bien", "bo de": "long-bien", "thach ban": "long-bien",
  // Tây Hồ
  "tay ho": "tay-ho", "xuan la": "tay-ho", "nhat tan": "tay-ho", "quang an": "tay-ho",
  "au co": "tay-ho", "lac long quan": "tay-ho",
  // Ba Đình
  "ba dinh": "ba-dinh", "ngoc ha": "ba-dinh", "kim ma": "ba-dinh",
  "giang vo": "ba-dinh", "doi can": "ba-dinh", "lieu giai": "ba-dinh",
  // Hoàn Kiếm
  "hoan kiem": "hoan-kiem", "hang bong": "hoan-kiem", "cua nam": "hoan-kiem",
  // Ngoại thành
  "gia lam": "gia-lam", "trau quy": "gia-lam", "duong xa": "gia-lam",
  "dong anh": "dong-anh", "co loa": "dong-anh",
  "thanh tri": "thanh-tri", "tu hiep": "thanh-tri", "ngoc hoi": "thanh-tri",
  "hoai duc": "hoai-duc", "an khanh": "hoai-duc", "kim chung": "hoai-duc",
};

// Từ khóa loại hình → slug room_type.
export const ROOM_TYPE_KEYWORDS: Record<string, string> = {
  "chung cu mini": "chung-cu-mini",
  ccmn: "chung-cu-mini",
  "chung cu": "chung-cu-mini",
  "khep kin": "khep-kin",
  "nha nguyen can": "nha-nguyen-can",
  "nguyen can": "nha-nguyen-can",
  "o ghep": "o-ghep",
  studio: "studio",
  officetel: "studio",
};

// Từ khóa tiện ích → slug amenity (nhiều từ khóa cùng trỏ 1 slug).
export const AMENITY_KEYWORDS: Record<string, string> = {
  "dieu hoa": "dieu-hoa",
  "may lanh": "dieu-hoa",
  "nong lanh": "nong-lanh",
  "binh nong lanh": "nong-lanh",
  wifi: "wifi",
  internet: "wifi",
  "gac xep": "gac-xep",
  "gac lung": "gac-xep",
  "ban cong": "ban-cong",
  "tu lanh": "tu-lanh",
  "may giat": "may-giat",
  "tu bep": "bep",
  "ke bep": "bep",
  "nau an": "bep",
  "thang may": "thang-may",
  "de xe": "cho-de-xe",
  "gui xe": "cho-de-xe",
  "do xe": "cho-de-xe",
  "ham xe": "cho-de-xe",
  "van tay": "khoa-van-tay",
  "khoa tu": "khoa-van-tay",
  "khoa thong minh": "khoa-van-tay",
  "gio giac tu do": "gio-giac-tu-do",
  "tu do gio giac": "gio-giac-tu-do",
  "gio giac": "gio-giac-tu-do",
  "tu do": "gio-giac-tu-do",
  camera: "camera",
  "an ninh": "camera",
  "thu cung": "nuoi-pet",
  "nuoi pet": "nuoi-pet",
  "nuoi cho": "nuoi-pet",
  "nuoi meo": "nuoi-pet",
  "full noi that": "full-noi-that",
  "noi that day du": "full-noi-that",
  "day du do": "full-noi-that",
  "do co ban": "full-noi-that",
  "setup do": "full-noi-that",
  "noi that": "full-noi-that",
  "giuong tu": "full-noi-that",
  "khong chung chu": "khong-chung-chu",
  "ko chung chu": "khong-chung-chu",
  "khong chu": "khong-chung-chu",
};
