// 게시글 등록
function page_insert() {
    location.href = "/board/insert";
}

async function board_insert() {
    const form = document.forms["insert_form"];
    await axios({
        method: "POST",
        url: "/board/insert",
        data: {
            u_id: form.u_id.value,
            category: form.category.value,
            title: form.title.value,
            content: form.content.value,
        },
    });
    location.href = "/board";
}
