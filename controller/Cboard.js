const { board, boardLike, comment } = require("../models");
const sequelize = require("sequelize");
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
            include: [
                {
                    model: boardLike,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            "(SELECT COUNT(*) FROM `board_like` WHERE `board_like`.`b_id` = `board`.`b_id`)",
                        ),
                        "like_count",
                    ],
                ],
            },
        });
        res.render("board/main", { boardList: boardList, totalPages: totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.board = async (req, res) => {
    try {
        const b_id = req.query.b_id;
        const boarder = await board.findOne({
            where: {
                b_id: b_id,
            },
            include: [
                {
                    model: boardLike, //모델연결
                    attributes: [],
                },
                {
                    model: comment,
                    attributes: ["b_id", "u_id", "content"], //코멘트 조인후 값 가져오기
                },
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            "(SELECT COUNT(*) FROM `board_like` WHERE `board_likes`.`b_id` = `board`.`b_id`)", //이게시물의 총 좋아요수
                        ),
                        "like_count",
                    ],
                ],
            },
        });
        console.log(boarder.comment);
        res.json(boarder); // 뷰 생성시 값전달
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
exports.handleLike = async (req, res) => {
    try {
        const { b_id, u_id } = req.body; //현재 게시글 b_id와 세션에 u_id를 받아온다
        const likeId = await boardLike.findOne({
            where: {
                b_id: req.body.b_id,
                u_id: req.body.u_id,
            },
        });
        if (likeId) {
            //해당값이 있을시 취소
            await boardLike.destroy({
                where: { bl_id: likeId.bl_id },
            });
            res.end();
        } else {
            //해당값이 없을시 추가
            await boardLike.create({
                b_id: b_id,
                u_id: u_id,
            });
            res.end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
