//수정 섬머노트js
function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

$(document).ready(function () {
    $("#summernote").summernote({
        height: 800, // 에디터 높이
        minHeight: 800, // 최소 높이
        maxHeight: 800, // 최대 높이
        focus: true, // 에디터 로딩후 포커스를 맞출지 여부
        lang: "ko-KR", // 한글 설정
        placeholder: "최대 2048자까지 쓸 수 있습니다", //placeholder 설정
        callbacks: {
            // 이미지를 업로드하는 부분
            onImageUpload: function (files) {
                uploadSummernoteImageFile(files[0], this);
            },
            onMediaDelete: function (target) {
                const delete_confirm = confirm(
                    "정말 삭제하시 겠습니까? 한번 삭제시 데이터는 사라집니다.\n(한장의 사진만 삭제됩니다.)",
                );
                if (delete_confirm) {
                    const imgNameList = [];
                    removeSummernoteImage(target, imgNameList);
                } else {
                    alert("취소 하였습니다.");
                    location.reload();
                }
            },
            onPaste: function (e) {
                let clipboardData = e.originalEvent.clipboardData;
                if (clipboardData && clipboardData.items && clipboardData.items.length) {
                    let item = clipboardData.items[0];
                    if (item.kind === "file" && item.type.indexOf("image/") !== -1) {
                        e.preventDefault();
                    }
                }
            },
            onKeydown: function (e) {
                if (e.keyCode === 8 || e.keyCode === 46) {
                    // 백스페이스 또는 딜리트 키
                    let range = $("#summernote").summernote("createRange");
                    let currentNode = range.sc;

                    // 현재 커서가 이미지에 위치하는지 확인
                    if (currentNode.children[0].tagName.toLowerCase() === "img") {
                        const delete_confirm = confirm(
                            "💥💢💥이미지 삭제는 마우스 왼쪽 클릭후 remove imgage 버튼을 이용하셔야 합니다.💥💢💥",
                        );
                        if (!delete_confirm) {
                            alert("취소 하였습니다.");
                            e.preventDefault(); // 취소 선택 시 이벤트를 중단합니다.
                        } else {
                            alert("감사합니다 😋");
                            e.preventDefault(); // 취소 선택 시 이벤트를 중단합니다.
                        }
                    }
                }
            },
        },
    });
    let board_content = document.querySelector(".update_content");
    let content = decodeHtml(board_content.value);

    // 역슬래시를 슬래시로 변경
    content = content.replace(/\/uploadshero/g, "/uploads/hero");
    $("#summernote").summernote("code", content);
});

async function uploadSummernoteImageFile(file, editor) {
    const data = new FormData();
    data.append("file", file);
    try {
        const response = await axios.post("/board/imgupload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const imageUrl = response.data;
        $(editor).summernote("insertImage", "/" + imageUrl);
    } catch (error) {
        console.error(error);
    }
}
async function removeSummernoteImage(target, imgNameList) {
    try {
        if (imgNameList.length != 0 || imgNameList.length === 1) {
            const res = await axios.post("/board/imgdelete", { imgName: imgNameList });
            return;
        }
        const imgName = target[0].src.split("/").pop(); // 이미지 이름 가져옴
        const res = await axios.post("/board/imgdelete", { imgName: imgName });
    } catch (error) {
        console.error("이미지 삭제 요청 실패:", error);
    }
}

/* 게시글 관련 */
// 게시글 수정 페이지로 이동
function page_update(b_id) {
    axios({
        method: "GET",
        url: "/board/update",
        params: { b_id: b_id },
    }).then((res) => {
        location.href = `/board/update?b_id=${b_id}`;
    });
}
// 게시글 수정
async function update_board(b_id) {
    if (confirm("글을 수정하시겠습니까?")) {
        let content = $("#summernote").summernote("code");
        const form = document.forms["update_form"];
        const srcRegex = /\/uploads\\([^"]+)"/g;
        const imgNameList = [];
        let match;

        while ((match = srcRegex.exec(content)) !== null) {
            imgNameList.push(match[1]);
        }
        //새로 등록되는 이미지리스트값
        const result = await axios({
            method: "PATCH",
            url: "/board",
            data: {
                b_id: form.b_id.value,
                category: form.category.value,
                title: form.title.value,
                content: content,
                imgNameList: imgNameList,
            },
        });
        if (result.status === 200) {
            alert("글이 수정되었습니다.");
            location.href = `/board/board?b_id=${b_id}`;
        } else {
            alert("수정에 실패하였습니다.");
        }
    } else {
        alert("수정을 취소하였습니다.");
    }
}
// 게시글 삭제
 function delete_board(b_id) {
    if (confirm("글을 삭제하시겠습니까?")) {
        axios({
            method: "DELETE",
            url: "/board",
            params: { b_id: b_id},
        }).then(function (res) {
            if (res.status === 200) {
                alert("글을 삭제하였습니다.");
            } else {
                alert("해당 글을 지우지 못했습니다.");
            }
            location.href = "/board";
        });
    } else {
        alert("취소하였습니다.");
    }
}
// 게시글 좋아요
async function like(b_id, u_id) {
    const likeBtn = document.querySelector(".btn_like");
    const response = await axios({
        method: "POST",
        url: "/board/like",
        data: { b_id: b_id, u_id: u_id },
    });
    document.getElementById("like_count").innerText = response.data.like_count;

    location.reload();
}
// 게시글 북마크
async function bookmark(b_id, u_id) {
    try {
        const bookmark = document.getElementById("bookmark");
        const response = await axios({
            method: "POST",
            url: "/board/bookmark",
            data: {
                b_id: b_id,
                u_id: u_id,
            },
        });
        location.reload();
    } catch (err) {
        console.error(err);
    }
}
/* 댓글 관련 */
// 댓글 작성
async function comment_insert() {
    const form = document.forms["comment"];
    await axios({
        method: "POST",
        url: "/board/comment",
        data: {
            b_id: form.b_id.value,
            u_id: form.u_id.value,
            nk_name: form.nk_name.value,
            content: form.comment_content.value,
            status: form.status.value,
        },
    });
    location.reload();
}
// 댓글, 답글 수정 폼 호출
function change_comment(c_id) {
    const updateTag = document.querySelector(`.update${c_id}`);
    const status = document.getElementById(`cmt${c_id}_status`);
    const contentInput = document.getElementById(`cmt${c_id}_content`);
    const content = document.getElementById(`cmt${c_id}_content`).innerText;
    const btn = document.getElementById(`cmt_update_btn${c_id}`);
    status.style.display = "block";
    contentInput.innerHTML = `<input id="update${c_id}" class="reply_content" value='${content}'></input>`;
    updateTag.style.display = "none";
    btn.setAttribute("onclick", `update_comment('${c_id}')`);
}
// 댓글, 답글 수정
async function update_comment(c_id) {
    const content = document.getElementById(`update${c_id}`).value;
    const status = document.getElementById(`cmt${c_id}_status`).value;
    await axios({
        method: "PATCH",
        url: "/board/comment",
        data: {
            c_id: c_id,
            content: content,
            status: status,
        },
    });
    location.reload();
}
// 댓글, 답글 삭제
async function comment_delete(c_id) {
    if (confirm("댓글을 삭제하시겠습니까?")) {
        await axios({
            method: "DELETE",
            url: "/board/comment",
            params: {
                c_id: c_id,
            },
        });
    }
    location.reload();
}
// 답글 등록 폼 호출
function call_reply_form(c_id) {
    const form = document.forms[`reply_form${c_id}`];
    form.style.display = "block";
    const btn = document.getElementById(`reply_btn${c_id}`);
    btn.setAttribute("type", "hidden");
}
// 답글 작성
async function reply_insert(c_id) {
    const form = document.forms[`reply_form${c_id}`];
    await axios({
        method: "POST",
        url: "/board/comment",
        data: {
            c_id: c_id,
            b_id: form.b_id.value,
            parent_id: form.parent_id.value,
            u_id: form.u_id.value,
            nk_name: form.nk_name.value,
            content: form.reply_content.value,
        },
    });
    location.reload();
}
