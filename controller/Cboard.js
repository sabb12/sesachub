const { board, boardLike } = require("../models");

exports.boardList = async (req, res) => {
    const page = req.query.page || 1; // 요청된 페이지 번호, 기본값은 1
    const pageSize = 5; // 한 페이지에 표시할 항목의 수
    try {
        const totalCount = await board.count(); // 전체 데이터의 수
        const totalPages = Math.ceil(totalCount / pageSize); // 전체 페이지 수
        const offset = (page - 1) * pageSize; // 오프셋 계산
        const boardList = await board.findAll({
            limit: pageSize,
            offset: offset,
        });
        for (let board of boardList) {
            const likeCount = await boardLike.count({ where: { b_id: board.b_id } });
            board.setDataValue("like_count", likeCount); // 보드 객체에 좋아요 수를 추가
        }
        res.render("board/main", { boardList: boardList, totalPages: totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
