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
const sortList = document.querySelector(".sort_list");

function sort(category, search) {
    let selectedValue = sortList.value;
    if (selectedValue === "latest") {
        location.href = `/board?category=${category}&like=&search=${search}`;
    } else if (selectedValue === "like") {
        location.href = `/board?category=${category}&like=like&search=${search}`;
    }
}
function searchPost(category) {
    const keyword = document.querySelector(".search_keyword").value;
    location.href = `/board?category=${category}&search=${keyword}`;
}

function searchOnEnter(event, category) {
    if (category === "undefined") {
        category = "";
    }
    if (event.key === "Enter") {
        searchPost(category);
    }
}
