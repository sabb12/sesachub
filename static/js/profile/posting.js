// 게시글 체크박스
const posting_checkAll = document.querySelector("#posting_checkAll");
const posting_chkbx = document.querySelectorAll(".posting_check-option");

// 1. 전체 선택 체크박스
posting_checkAll.addEventListener("change", (e) => {
    const isChecked = posting_checkAll.checked;
    posting_chkbx.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 각 체크박스
posting_chkbx.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const allChecked = Array.from(posting_chkbx).every((checkbox) => checkbox.checked);
        posting_checkAll.checked = allChecked;
    });
});

// 2. BookMark 체크박스
const bookMark_checkAll = document.querySelector("#bookMark_checkAll");
const bookMark_chkbx = document.querySelectorAll(".bookMark_check-option");

// 전체 선택 체크박스
bookMark_checkAll.addEventListener("change", (e) => {
    const isChecked = bookMark_checkAll.checked;
    bookMark_chkbx.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 각 체크박스
bookMark_chkbx.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const allChecked = Array.from(bookMark_chkbx).every((checkbox) => checkbox.checked);
        bookMark_checkAll.checked = allChecked;
    });
});

function deletePosting(b_id, content) {
    if (confirm("글을 삭제하시겠습니까?")) {
        console.log(content);
        const srcRegex = /\/uploads([^"]+)"/g;
        const imgNameList = [];
        let match;

        while ((match = srcRegex.exec(content)) !== null) {
            imgNameList.push(match[1]);
        }
        //새로 등록되는 이미지리스트값
        console.log(imgNameList);
        axios({
            method: "DELETE",
            url: "/board",
            params: { b_id: b_id, imgNameList: imgNameList },
        }).then(function (res) {
            if (res.status === 200) {
                alert("삭제 성공하였습니다.");
                location.href = "/profile/posting";
            } else {
                alert("삭제 실패하였습니다.");
            }
        });
    } else {
        alert("취소하였습니다.");
    }
}

// 체크 된 게시글 전부 삭제
function deletePostingAll() {
    const checkedPostings = Array.from(
        document.querySelectorAll(".posting_check-option:checked"),
    ).map((checkbox) => {
        return checkbox.parentElement.parentElement;
    });
    if (checkedPostings.length > 0) {
        const areYouSure = confirm("전체 삭제하시겠습니까?");
        if (areYouSure) {
            for (let posting of checkedPostings) {
                const b_id = posting
                    .querySelector(".posting_check-option")
                    .getAttribute("data-b-id");
                axios({
                    method: "DELETE",
                    url: "/board",
                    params: {
                        b_id: b_id,
                    },
                })
                    .then(function (res) {
                        location.href = "/profile/posting";
                        posting.checked = false;
                    })
                    .catch((error) => {
                        console.error("Error deleting posting:", error);
                    });
            }
        }
    }
}

// 각 북마크 삭제
function deleteBookmark(b_id, u_id) {
    const areYouSure = confirm("삭제하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "POST",
            url: "/board/bookmark",
            data: {
                b_id: b_id,
                u_id: u_id,
            },
        }).then(function (res) {
            location.href = "/profile/posting";
        });
    }
}

function deleteBookmarkAll() {
    const checkedBookMark = Array.from(
        document.querySelectorAll(".bookMark_check-option:checked"),
    ).map((checkbox) => {
        return checkbox.parentElement.parentElement;
    });
    if (checkedBookMark.length > 0) {
        const areYouSure = confirm("전체 삭제하시겠습니까?");
        if (areYouSure) {
            for (let bookmark of checkedBookMark) {
                const b_id = bookmark
                    .querySelector(".bookMark_check-option")
                    .getAttribute("data-b-id");
                const u_id = bookmark
                    .querySelector(".bookMark_check-option")
                    .getAttribute("data-u-id");
                axios({
                    method: "POST",
                    url: "/board/bookmark",
                    data: {
                        b_id: b_id,
                        u_id: u_id,
                    },
                })
                    .then(function (res) {
                        location.href = "/profile/posting";
                        bookmark.checked = false;
                    })
                    .catch((error) => {
                        console.error("Error deleting all bookMark:", error);
                    });
            }
        }
    }
}

async function postPage(pageNum) {
    try {
        const response = await axios.post("/profile/posting", { pageNum, action: "posts" });
        const postings = response.data.postings;
        const pCntr = document.getElementById("postingCntr");
        // 글 목록을 비움
        pCntr.innerHTML = "";
        postings.forEach((post) => {
            let tr = document.createElement("tr"); // 행 생성

            let tdCheck = document.createElement("td"); // check 셀 생성
            tdCheck.classList.add("check_all");
            tdCheck.innerHTML = `<input type="checkbox" name="checkbox" class="posting_check-option" data-b-id="${post.b_id}" />`;

            let tdID = document.createElement("td"); // 글 번호 셀 생성
            tdID.textContent = `${post.b_id}`;

            let tdTitle = document.createElement("td"); // 글 제목 셀 생성
            tdTitle.innerHTML = `<a href="/board/board?b_id=${post.b_id}">${post.title}</a>`;

            let tdTime = document.createElement("td"); // 글 작성 시간 셀 생성
            tdTime.textContent = `${post.createdAt.toLocaleString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            })}`;

            let tdBtn = document.createElement("td"); // 글 삭제 버튼 셀 생성
            tdBtn.innerHTML = `<button class="delete_button" onclick="deletePosting('${post.b_id}')">삭제</button>`;

            // 생성한 셀을 행에 추가
            tr.append(tdCheck, tdID, tdTitle, tdTime, tdBtn);

            // 행을 테이블에 추가
            pCntr.append(tr);
        });
        // document.querySelectorAll(`.postPage${pageNum}`).forEach((item) => {
        //     item.addEventListener("click", function (e) {
        //         e.preventDefault();

        //         const page = document.querySelectorAll(`.postPage${pageNum}`);
        //         page[0].classList.add("on");
        //         page.forEach((link) => {
        //             link.classList.remove("on");
        //         });
        //         this.classList.add("on");
        //     });
        // });
    } catch (err) {
        console.log("posting postPage error :: ", err);
    }
}

async function bookmarkPage(pageNum) {
    try {
        const response = await axios.post("/profile/posting", { pageNum, action: "bookmarks" });
        const bookmarkPostings = response.data.bookmarkPostings;
        const bCntr = document.getElementById("bookmarkCntr");
        // 글 목록을 비움
        bCntr.innerHTML = "";
        bookmarkPostings.forEach((bookmark) => {
            let tr = document.createElement("tr"); // 행 생성

            let tdCheck = document.createElement("td"); // check 셀 생성
            tdCheck.classList.add("check_all");
            tdCheck.innerHTML = `<input type="checkbox" name="checkbox" class="bookMark_check-option" data-b-id="${bookmark.b_id}" data-u_id="${bookmark.u_id}" />`;

            let tdID = document.createElement("td"); // 글 번호 셀 생성
            tdID.textContent = `${bookmark.b_id}`;

            let tdTitle = document.createElement("td"); // 글 제목 셀 생성
            tdTitle.innerHTML = `<a href="/board/board?b_id=${bookmark.b_id}">${bookmark.title}</a>`;

            let tdTime = document.createElement("td"); // 글 작성 시간 셀 생성
            tdTime.textContent = `${bookmark.createdAt.toLocaleString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            })}`;

            let tdBtn = document.createElement("td"); // 글 삭제 버튼 셀 생성
            tdBtn.innerHTML = `<button class="delete_button" onclick="deletBookmark('${bookmark.b_id}','${bookmark.u_id}')">삭제</button>`;

            // 생성한 셀을 행에 추가
            tr.append(tdCheck, tdID, tdTitle, tdTime, tdBtn);

            // 행을 테이블에 추가
            bCntr.append(tr);
        });
        // document.querySelectorAll(`.bookmarkPage${pageNum}`).forEach((item) => {
        //     item.addEventListener("click", function (e) {
        //         e.preventDefault();
        //         const page = document.querySelectorAll(`.bookmarkPage${pageNum}`);
        //         page[0].classList.add("on");
        //         page.forEach((link) => {
        //             link.classList.remove("on");
        //         });
        //         this.classList.add("on");
        //     });
        // });
        document.querySelector(`.bookmarkPage${pageNum}`).classList.add("on");
    } catch (err) {
        console.log("posting bookmarkPage error :: ", err);
    }
}
