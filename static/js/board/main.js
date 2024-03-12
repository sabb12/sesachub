//에디터 js
$("#summernote").summernote({
    height: 800, // 에디터 높이
    minHeight: 800, // 최소 높이
    maxHeight: 800, // 최대 높이
    lang: "ko-KR", // 한글 설정
    callbacks: {
        // 이미지를 업로드하는 부분
        onImageUpload: function (files) {
            uploadSummernoteImageFile(files[0], this);
        },
        onMediaDelete: function (target) {
            const imgNameList = [];
            removeSummernoteImage(target, imgNameList);
        },
        onPaste: function (e) {
            var clipboardData = e.originalEvent.clipboardData; //에디터에 데이터접근
            if (clipboardData && clipboardData.getData) {
                //클립보드에 데이터가 있고, 그 안에 항목이 있는 경우에만 동작
                var pastedData = clipboardData.getData("text/html");
                if (pastedData && pastedData.includes("<img")) {
                    //첫번째항목이 이미지면 이벤트 막는다.
                    e.preventDefault();
                }
            }
        },
        onKeydown: function (e) {
            console.log(e.keyCode);
            if (e.keyCode === 8 || e.keyCode === 46) {
                // 백스페이스 또는 딜리트 키
                // 입력된 내용을 HTML로 파싱
                var htmlContent = $(this).summernote("code");

                const srcRegex = /\/uploads\\([^"]+)"/g;
                const imgNameList = [];
                let match;

                while ((match = srcRegex.exec(htmlContent)) !== null) {
                    imgNameList.push(match[1]);
                }
                console.log(imgNameList);
                // 파싱된 HTML에서 이미지 태그를 찾음
                var hasImage = $(htmlContent).find("img").length > 0;
                // 이미지를 포함하는지 확인
                if (hasImage) {
                    // 이미지 삭제 로직 실행
                    removeSummernoteImage(e, imgNameList);
                }
            }
        },
    },
});

/**
 * 이미지 파일 업로드
 */
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
        console.log(imageUrl);
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
        const imgName = target[0].src.split("/").pop();
        console.log(imgName); //이미지 이름 가져옴
        const res = await axios.post("/board/imgdelete", { imgName: imgName });
        console.log("이미지 삭제 요청 성공:", res.data);
    } catch (error) {
        console.error("이미지 삭제 요청 실패:", error);
    }
}

// 게시글 등록
function page_insert() {
    location.href = "/board/insert";
}

async function board_insert() {
    const form = document.forms["insert_form"];
    const content_code = $("#summernote").summernote("code");
    content = content_code.trim(); // 앞뒤 공백 제거
    content = content_code.replace(/\s{2,}/g, " ");
    console.log(content);
    // 정규 표현식을 사용하여 img 태그에서 src 속성값 추출
    const srcRegex = /\/uploads\\([^"]+)"/g;
    const srcArray = [];
    let match;

    while ((match = srcRegex.exec(content)) !== null) {
        srcArray.push(match[1]);
    }

    console.log(srcArray);

    await axios({
        method: "POST",
        url: "/board/insert",
        data: {
            u_id: form.u_id.value,
            category: form.category.value,
            title: form.title.value,
            content: content,
            srcArray: srcArray,
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
