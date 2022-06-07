// 비밀번호 체크
document.querySelector("#pwCheck").onblur = isEqualPw;

document.memberFrm.onsubmit = function(){
  const userId = document.getElementById("userId");
  const password = document.getElementById("password");
  const userName = document.getElementById("userName");
  const userBirth = document.getElementById("userBirth");
  const userEmail = document.getElementById("userEmail");
  const tel1 = document.getElementById("tel1");
  const tel2 = document.getElementById("tel2");
  const tel3 = document.getElementById("tel3");

  // 아이디 유효성 검사 (4~12자리, 영어소문자·숫자 가능)
  const regexp1 = /^[a-z0-9]{4,12}$/;

  if(!regexpTest(regexp1, userId, "아이디는 4~12자리, 영소문자와 숫자만 가능합니다."))
    return false;
  
  // 비밀번호 확인 검사 (8~15자리, 숫자/영문자/특수문자(!@#$*_) 포함)
  const regexp2 = [/^.{8,15}$/, /\d/, /[a-zA-z]/, /[!@#$*_]/];

  for (let i = 0; i < regexp2.length; i++){
    if(!regexpTest(regexp2[i], password, "비밀번호는 8~15자리, 숫자/영문자/특수문자(!@#$*_) 포함해야 합니다."))
      {
        return false;
      }
  }

  // 비밀번호 일치여부
  if(!isEqualPw()) {
    return false;
  }

  // 이름 검사
  const regexp3 = /^[가-힣]+$/;
  if(!regexpTest(regexp3, userName, "한글만 입력 가능합니다."))
    return false;
  
  // 생년월일 검사
  const regexp4 = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[01])$/;
  if(!regexpTest(regexp4, userBirth, "양식에 맞게 입력해 주세요. (ex.900909)"))
    return false;

  // 이메일 검사
  const regexp5 = /^[\w]+@[\w]+(\.[\w]+){1,3}$/;
  if(!regexpTest(regexp5, userEmail, "이메일 형식이 적합하지 않습니다."))
    return false;

  // 전화번호 검사
  const regexp6 = /^[0-9]{3,4}$/;
  if(!regexpTest(regexp6, tel1, "전화번호를 다시 확인해 주세요."))
    return false;
  if(!regexpTest(regexp6, tel2, "전화번호를 다시 확인해 주세요."))
    return false;
  if(!regexpTest(regexp6, tel3, "전화번호를 다시 확인해 주세요."))
    return false;

}

function isEqualPw() {
  if(password.value === pwCheck.value) {
    return true;
  }
  else {
    alert("비밀번호가 일치하지 않습니다.");
    password.select();
    return false;
  }
}

function regexpTest(regexp, el, msg) {
  if(regexp.test(el.value)) return true;
  alert(msg);
  el.value="";
  el.select();
  return false;
};

class MemberInfo {
  constructor(userId, password, userName, userBirth, userEmail, tel, signdate = Date.now()) {
    this.userId = userId;
    this.password = password;
    this.userName = userName;
    this.userBirth = userBirth;
    this.userEmail = userEmail;
    this.tel = tel;
    this.signdate = signdate;
  }
}

const saveMemberInfo = () => {
  const userIdVal = userId.value;
  const PwVal = password.value;
  const userNameVal = userName.value;
  const userBirthVal = userBirth.value;
  const userEmailVal = userEmail.value;
  const telVal = (tel1.value+"-"+tel2.value+"-"+tel3.value);

  const memberInfo = new MemberInfo(userIdVal, PwVal, userNameVal, userBirthVal, userEmailVal, telVal);

  const memberInfoList = JSON.parse(localStorage.getItem("memberInfoList")) || [];
  memberInfoList.push(memberInfo);

  console.log(memberInfo);
  const data = JSON.stringify(memberInfoList);
  console.log(data);

  localStorage.setItem('memberInfoList', data);

  document.memberFrm.reset();

  renderMemberInfo(memberInfoList);
};

const renderMemberInfo = (memberInfoList = JSON.parse(localStorage.getItem("memberInfoList"))) => {
  if(!memberInfoList) return;
  const tbody = document.querySelector("#tb-memberbook tbody");
  tbody.innerHTML = "";
  memberInfoList
    .map((memberInfo, index) => {
      const {userId, password, userName, userBirth, userEmail, tel, signdate} = memberInfo;
      return `<tr>
        <td>${index + 1}</td>
        <td>${userId}</td>
        <td>${password}</td>
        <td>${userName}</td>
        <td>${userBirth.substring(0, 2)}년 ${userBirth.substring(2, 4)}월 ${userBirth.substring(4)}일</td>
        <td>${userEmail}</td>
        <td>${tel}</td>
        <td>${signdateFormatter(signdate)}</td>
      </tr>`;
    })
    .forEach((tr) => {
      tbody.innerHTML += tr;
    });
}

const signdateFormatter = (mills) => {
  const d = new Date(mills);
    const f = (n) => n < 10 ? '0' + n : n;
    const yyyy = d.getFullYear();
    const mm = f(d.getMonth() + 1);
    const dd = f(d.getDate());
    return `${yyyy}/${mm}/${dd}`;
};

