import moment from "moment";
export function formatCostNumber(val) {
  if (val === undefined || val === null) return null;
  if (isNaN(val)) return val;
  // remove sign if negative
  var sign = 1;
  if (val < 0) {
    sign = -1;
    val = -val;
  }

  // trim the number decimal point if it exists
  let num = val.toString().includes(".")
    ? val.toString().split(".")[0]
    : val.toString();

  while (/(\d+)(\d{3})/.test(num.toString())) {
    // insert comma to 4th last position to the match number
    num = num.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }

  // add number after decimal point
  if (val.toString().includes(".")) {
    num = num + "." + val.toString().split(".")[1];
  }

  // return result with - sign if negative
  num = sign < 0 ? "-" + num : num;
  return num + " VNĐ";
}

export function formatDate(date) {
  if (date == null || date === undefined) return null;
  return moment(date).format("LLL");
}

export function formatDateShip(date) {
  if (date == null || date === undefined) return null;
  return moment(date).format("LL");
}

export function fomatQuantity(quantity) {
  return quantity.toFixed(1);
}

export function isValidData(data) {
  // if (data === "") return false;

  if (data.trim() === "") {
    return false;
  }

  // Kiểm tra nếu dữ liệu không bắt đầu bằng chữ cái a-z
  if (
    !data.match(
      /^[a-zA-ZÀ-ỹỲỸÁẠẢÂẤẦẨẪẬĂẮẰẲẴẶÈỀỂỄÉẸẺÊẾỀỂỄỆÌÍỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦỤƯỨỪỬỮỰỲÝỴa-zà-ỹỳỹáạảâấầẩẫậăắằẳẵặèềểễéẹẻêếềểễệìíỉịòóõọỏôốồổỗộơớờởỡợùúủụưứừửữựỳýỵ\s]*$/
    )
  ) {
    return false;
  }

  // Kiểm tra nếu dữ liệu có khoảng trắng dư thừa
  if (data.trim() !== data.replace(/\s+/g, " ")) {
    return false;
  }

  // Nếu không có lỗi nào được phát hiện, trả về true
  return true;
}

export function isValidPhoneNumber(data) {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(data);
}
export function isValidNumber(input) {
  if (typeof input === "number" && input > 0) return true;
  if (
    typeof input !== "string" ||
    input.trim() === "" ||
    !/^\d+(\.\d+)?$/.test(input)
  ) {
    // Nếu input không phải là chuỗi hoặc là chuỗi rỗng, hoặc chứa ký tự khác số hoặc dấu chấm
    return false;
  }

  // Nếu input bắt đầu bằng số 0
  if (input.startsWith("0")) {
    // Nếu input là số nguyên, thì không hợp lệ
    if (/^0\d+$/.test(input)) {
      return false;
    }

    // Nếu input là số thập phân hợp lệ, thì hợp lệ
    if (/^0\.\d+$/.test(input)) {
      return true;
    }

    // Ngược lại, không hợp lệ
    return false;
  }

  // Nếu input là số dương, hợp lệ
  return parseFloat(input) > 0;
}

export function isValidCost(input) {
  if (typeof input === "number" && input > 0) return true;
  if (
    typeof input !== "string" ||
    input.trim() === "" ||
    !input.match(/^\d+$/)
  ) {
    // Nếu input không phải là chuỗi hoặc là chuỗi rỗng, hoặc chứa ký tự khác số hoặc dấu chấm
    return false;
  }

  // Nếu input bắt đầu bằng số 0
  if (input.startsWith("0")) return false;

  // Nếu input là số dương, hợp lệ
  return parseInt(input) > 0;
}

export function isValidEmail(email) {
  const trimmedEmail = email.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy kiểm tra email hợp lệ
  return emailRegex.test(trimmedEmail) && trimmedEmail.endsWith("@gmail.com"); // Kiểm tra email hợp lệ và chứa "@gmail.com"
}

export function isValidDate(inputDate) {
  // Lấy ngày hiện tại
  var today = new Date();
  // Tách chuỗi inputDate thành ngày, tháng, năm
  var parts = inputDate.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);
  if (year > today.getFullYear()) return false;
  // Tạo đối tượng Date từ ngày, tháng, năm nhập vào
  var inputDateObj = new Date(year, month - 1, day);
  // Kiểm tra xem ngày nhập vào có hợp lệ hay không
  if (
    inputDateObj.getFullYear() === year &&
    inputDateObj.getMonth() === month - 1 &&
    inputDateObj.getDate() === day
  ) {
    // Kiểm tra xem ngày nhập vào có vượt quá ngày hiện tại không
    // if (inputDateObj.getTime() >= today.getTime()) {
    //   return false;
    // } else {
    //   return true;
    // }
    return true;
  } else {
    return false;
  }
}
