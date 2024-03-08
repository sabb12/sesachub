function permissionAdd(u_id) {
    if (!u_id) {
        let check = "permissionAdd";
        extractValues(check);
    } else {
        var selectValue = document.getElementById("permissionSelect").value;
        permissionInsert(u_id, selectValue);
    }
}
function course_update(u_id) {
    if (!u_id) {
        let check = "courseAdd";
        extractValues(check);
    } else {
        var selectValue = document.getElementById("classSelect").value;
        courseAdd(u_id, selectValue);
    }
}
async function courseAdd(u_id, course) {
    let confirmResult = confirm("수업을 변경 하시겠습니까?");

    if (confirmResult) {
        const res = await axios({
            method: "patch",
            url: "/admin/course",
            data: { u_id: u_id, course: course },
        });
        if (res.data === true) {
            alert("수업 변경 성공하였습니다");
            location.reload();
        } else {
            alert("수업 변경 실패 하였습니다.");
        }
    }
}
async function permissionInsert(u_id, selectValue) {
    let confirmResult = confirm("권한을 부여 하시겠습니까?");

    if (confirmResult) {
        const res = await axios({
            method: "patch",
            url: "/admin/permission",
            data: {
                u_id: u_id,
                selectValue: selectValue,
            },
        });
        if (res.data === true) {
            alert("권한부여 성공하였습니다.\n회원관리 페이지로 이동합니다.");
            location.href = "/admin/user";
        } else {
            alert("권한부여 실패하였습니다.");
        }
    } else {
        alert("부여 실패하였습니다");
    }
}
async function pwReset(u_id) {
    if (!u_id) {
        let check = "pwReset";
        extractValues(check);
    } else {
        let confirmResult = confirm("초기화 하시겠습니까?\n초기화시 비밀번호는 sesac123 입니다.");
        if (confirmResult) {
            const res = await axios({
                method: "patch",
                url: "/admin/user",
                data: { u_id: u_id },
            });
            if (res.data === true) {
                alert("초기화에 성공 하였습니다");
            } else {
                alert("초기화에 실패 하였습니다");
            }
        } else {
            alert("초기화에 취소 하였습니다");
        }
    }
}

function extractValues(check) {
    const memberDataRows = document.querySelectorAll(".member_data");
    let u_id;
    let permission;
    memberDataRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        u_id = cells[0].textContent; // 첫 번째 셀의 텍스트 값을 가져옴
        permission = cells[3].textContent; // 네 번째 셀의 텍스트 값을 가져옴
        if (check === "permission_delete") {
            permission_delete(u_id);
        } else if (check === "pwReset") {
            pwReset(u_id);
        } else if (permissionAdd === "permissionAdd") {
            permissionAdd(u_id);
        } else {
            course_update(u_id);
        }
    });
}

async function permission_delete(u_id) {
    if (u_id) {
        const deleteConfirm = confirm(
            "정말 삭제 하시겠습니까?\n💥💢한번 삭제하면 다신 복구할 수 없습니다.💥💢",
        );
        if (deleteConfirm) {
            const res = await axios({
                method: "delete",
                url: "/admin/user",
                params: { u_id: u_id },
            });
            if (res.data === true) {
                alert("삭제 성공하였습니다.\n회원 전체페이지로 이동합니다.");
                location.href = "/admin/user";
            } else {
                alert("삭제 실패하였습니다");
            }
        } else {
            alert("취소 하셨습니다.");
        }
    } else {
        let check = "permission_delete";
        extractValues(check);
    }
}

function openModal(u_id, name, course, permission) {
    const table = document.querySelector(".member_table");
    const newRow = document.createElement("tr");
    newRow.classList.add("member_data");
    let html = "";
    let html2 = "";
    html += `
            <span>권한없음</span><br>
            <select id="permissionSelect">
                <option value="admin">관리자</option>
                <option value="student">수강생</option>
                <option value="graduate_student">수료생</option>
                <option value="user">관계자</option>
            </select>
            <button class="permissionBtn" onclick="permissionAdd()">권한부여</button>`;

    html2 += `<select id="classSelect">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            <button class="permissionBtn" onclick="course_update()">수업 변경</button>`;

    // 새로운 <tr> 요소에 데이터를 포함하는 <td> 요소들을 추가합니다.
    newRow.innerHTML = `
        <td>${u_id}</td>
        <td>${name}</td>
        <td>${course}<br>${html2}</td>
        <td>${permission ? permission : html}</td>
    `;

    // 기존 테이블 요소에 새로운 <tr> 요소를 추가합니다.
    table.appendChild(newRow);
    var modal = document.getElementById("myModal");
    modal.style.display = "block"; // 모달을 화면에 보이도록 설정
}

// 모달외부 영역 클릭 시 모달 닫기
var modal = document.getElementById("myModal");
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        var table = document.querySelector(".member_table");
        table.querySelectorAll(".member_data").forEach((row) => row.remove());
    }
};
