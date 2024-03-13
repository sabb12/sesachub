const { board, boardLike, comment, bookMark, user, boardImg } = require("../models");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const fs = require("fs");

// 전체 게시글 조회 ( 카테,좋아요,최신순,검색)
exports.boardList = async (req, res) => {
    const page = req.query.page || 1; // 요청된 페이지 번호, 기본값은 1
    const category = req.query.category;
    const like = req.query.like;
    const pageSize = 10; // 한 페이지에 표시할 항목의 수
    try {
        if (!category) {
            const totalCount = await board.count(); // 전체 데이터의 수
            const totalPages = Math.ceil(totalCount / pageSize); // 전체 페이지 수
            const offset = (page - 1) * pageSize; // 오프셋 계산
            let orderby = [];
            if (like) {
                orderby.push("like_count");
            } else {
                orderby.push("b_id");
            }

            // 검색어가 있는 경우에만 검색 쿼리를 적용 추후 검색엔진 추가예정
            const search = {};
            if (req.query.search) {
                search[Op.or] = [{ title: { [Op.like]: `%${req.query.search}%` } }];
            }

            const boardList = await board.findAll({
                limit: pageSize,
                offset: offset,
                include: [
                    {
                        model: user,
                        attributes: ["nk_name","profile_img"],
                    },
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
                where: search,
                order: [
                    [sequelize.literal(orderby), "DESC"], // 카테고리가 없을시 전체리스트에서 좋아요순
                ],
            });

            res.render("board/main", {
                boardList: boardList,
                category: category,
                totalPages: totalPages,
                search: req.query.search,
            });
        } else {
            let orderby = [];
            if (like) {
                orderby.push("like_count");
            } else {
                orderby.push("b_id");
            }
            const search = {};
            if (req.query.search) {
                search[Op.or] = [
                    { title: { [Op.like]: `%${req.query.search}%` } },
                    { content: { [Op.like]: `%${req.query.search}%` } },
                ];
            }
            const totalCount = await board.count({
                where: {
                    category: category, // 카테고리가 있는 경우만 조회
                    ...search, // 검색어 조건 추가
                },
            });

            const totalPages = Math.ceil(totalCount / pageSize); // 전체 페이지 수
            const offset = (page - 1) * pageSize; // 오프셋 계산
            const boardList = await board.findAll({
                where: {
                    category: category, // 카테고리가 있는 경우만 조회
                    ...search, // 검색어 조건 추가
                },
                limit: pageSize,
                offset: offset,
                include: [
                    {
                        model: user,
                        attributes: ["nk_name","profile_img"],
                    },
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
                order: [
                    [sequelize.literal(orderby), "DESC"], // like가 있을시 해당 카테고리에 좋아요순
                ],
            });
            res.render("board/main", {
                boardList: boardList,
                category: category,
                totalPages: totalPages,
                search: req.query.search,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 해당 게시글 조회
exports.board = async (req, res) => {
    try {
        const b_id = req.query.b_id;
        const boarder = await board.findOne({
            where: {
                b_id: b_id,
            },
            include: [
                {
                    model: user,
                    attributes: ["nk_name", "profile_img"],
                },
                {
                    model: boardLike,
                    attributes: ["u_id"],
                },
                {
                    model: bookMark,
                    attributes: ["u_id"],
                },
                {
                    model: comment,
                    attributes: [
                        "c_id",
                        "nk_name",
                        "content",
                        "parent_id",
                        "updatedAt",
                        "u_id",
                        "status",
                    ], // 댓글 가져오기
                    as: "comments", // 별칭 추가
                    include: [
                        {
                            model: user,
                            attributes: ["u_id", "profile_img"],
                        },
                        {
                            model: comment, // 대댓글 모델 include
                            as: "replies", // 대댓글 모델의 별칭 설정
                            attributes: [
                                "c_id",
                                "parent_id",
                                "nk_name",
                                "updatedAt",
                                "u_id",
                                "content",
                                "status",
                            ], // 대댓글의 속성 선택
                            include: [
                                {
                                    model: user,
                                    attributes: ["u_id", "profile_img"],
                                },
                            ],
                        },
                    ],
                    where: { parent_id: null }, // 부모 댓글만 가져오도록 추가된 where 조건
                    required: false, // 해당 모델이 없는 경우에도 결과를 반환하도록 설정
                },
            ],
            order: [
                ["comments", "c_id", "ASC"], // 댓글 오름차순으로 정렬
                [{ model: comment, as: "comments", include: "replies" }, "c_id", "ASC"], // 대댓글 오름차순으로 정렬
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
        // if (boarder.status === "PRIVATE") {
        //     for (let comment of boarder.comments) {
        //         if (
        //             req.session.permission !== "admin" &&
        //             boarder.u_id !== req.session.u_id &&
        //             comment.u_id !== req.session.u_id
        //         ) {
        //             comment.content = "비밀 댓글입니다.";
        //         }
        //     }
        // }
        // console.log(board.comments.status);
        res.render("board/board", { board: boarder }); // 뷰 생성시 값전달
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 좋아요 추가 취소
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
        } else {
            //해당값이 없을시 추가
            await boardLike.create({
                b_id: b_id,
                u_id: u_id,
            });
        }
        const likeCount = await boardLike.count({
            where: { b_id: b_id },
        });
        res.send({ like_count: likeCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 게시글 삭제
exports.boardDelete = async (req, res) => {
    try {
        const b_id = Number(req.query.b_id);
        const imgNameList = req.query.imgNameList;
        console.log(imgNameList);

        const imgNames = Array.isArray(imgNameList) ? imgNameList : [imgNameList]; // 이미지 이름 배열 또는 단일 값으로 변환

        // 모든 이미지에 대해 순차적으로 처리
        for (const img of imgNames) {
            try {
                // 파일 경로 설정
                const filePath = `uploads/${img}`;

                // 파일 삭제
                await fs.promises.unlink(filePath);

                // 이미지 정보 삭제
                await boardImg.destroy({
                    where: {
                        path: img,
                    },
                });

                console.log(`이미지 정보 ${img} 삭제 완료`);
            } catch (error) {
                console.error(`이미지 정보 ${img} 삭제 중 오류:`, error);
                return res.status(500).send("이미지 정보 삭제 중 오류가 발생했습니다.");
            }
        }

        // 게시물 삭제
        await board.destroy({
            where: { b_id: b_id },
        });

        res.status(200).send("게시물 및 이미지가 성공적으로 삭제되었습니다.");
    } catch (error) {
        console.error(error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
};

// 게시글 등록 페이지 이동
exports.boardWritePage = function (req, res) {
    res.render("board/insert");
};
// 게시글등록
exports.boardInsert = async (req, res) => {
    try {
        const { u_id, title, content, category, srcArray } = req.body;
        console.log(content, srcArray);
        const insert = await board.create({
            u_id: u_id,
            title: title,
            content: content,
            category: category,
        });
        if (insert) {
            const b_id = insert.b_id; // 새로 생성된 게시글의 ID

            // 각 이미지에 대해 보드 이미지 생성
            for (let src of srcArray) {
                const img_result = await boardImg.create({
                    b_id: b_id,
                    path: src,
                });
            }
            res.send("등록성공");
        } else {
            res.send("등록실패");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 게시글 수정 페이지 이동
exports.boardUpdatePage = async function (req, res) {
    try {
        const { b_id } = req.query;
        const boardInfo = await board.findOne({
            attributes: ["b_id", "category", "title", "content"],
            where: {
                b_id: b_id,
            },
        });
        console.log(boardInfo);
        res.render("board/update", { board: boardInfo });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 게시글 수정
exports.boardPatch = async (req, res) => {
    try {
        const { b_id, title, content, category, imgNameList } = req.body;
        const imgList=[];

        for (const imgName of imgNameList) {
            try {
                const img = await boardImg.findOne({ where: { path: imgName } });
                if (!img) {
                    // 이미지 테이블에 존재하지 않으면 imgList에 추가
                    imgList.push(imgName);
                }
            } catch (error) {
                console.error(`이미지 정보 조회 중 오류 (${imgName}):`, error);
            }
        }  

        const update = await board.update(
            {
                title: title,
                content: content,
                category: category,
            },
            {
                where: { b_id: b_id },
            },
        );
        if (update) {
            for (let src of imgList) {
                const img_result = await boardImg.create({
                    b_id: b_id,
                    path: src,
                });
            }
            res.send("수정성공");
        } else {
            res.send("수정실패");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 댓글 대댓글 등록
exports.commentInsert = async (req, res) => {
    try {
        const { u_id, nk_name, b_id, content, parent_id, status } = req.body;

        const result = await comment.create({
            nk_name: nk_name,
            u_id: u_id,
            b_id: b_id,
            parent_id: parent_id,
            content: content,
            status: status,
        });
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 댓글 대댓글 수정
exports.commentPatch = async (req, res) => {
    try {
        const { c_id, content, status } = req.body;
        const result = await comment.update(
            {
                content: content,
                status: status,
            },
            {
                where: { c_id: c_id },
            },
        );
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 댓글 대댓글 삭제
exports.commentDelete = async (req, res) => {
    try {
        const result = await comment.destroy({
            where: {
                c_id: req.query.c_id,
            },
        });
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
// 북마크등록
exports.bookmarkInsert = async (req, res) => {
    try {
        const { u_id, b_id } = req.body;
        const result = await bookMark.findOne({
            where: { u_id: u_id, b_id: b_id },
        });
        if (result) {
            const bookMarkDelete = await bookMark.destroy({
                where: {
                    b_id: b_id,
                    u_id: u_id,
                },
            });
        } else {
            const insert = await bookMark.create({
                b_id: b_id,
                u_id: u_id,
            });
        }
        res.send({ result: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

//파일 업로드후 미리보기 뿌려주기
exports.imgupload = async (req, res) => {
    // 파일 업로드가 완료되면 이 곳에서 처리합니다.
    // req.file에 업로드된 파일에 대한 정보가 담겨 있습니다.
    console.log("진입");
    console.log(req.file);
    const file = req.file;
    if (!file) {
        return res.status(400).send("파일이 업로드되지 않았습니다.");
    }
    const filePath = file.path; //파일경로
    console.log("filePath ::", filePath);

    res.send(filePath);
};

//수정중 파일삭제시

exports.imgdelete = async (req, res) => {
    const { imgName } = req.body;

    try {
        const imgNames = Array.isArray(imgName) ? imgName : [imgName]; // 이미지 이름 배열 또는 단일 값으로 변환

        // 각 이미지에 대해 처리
        for (const img of imgNames) {
            const filePath = `uploads/${img}`; // 파일 경로 설정

            // 파일 삭제
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error(`파일 삭제 중 오류 (${img}):`, err);
                    return res.status(500).send("파일 삭제 중 오류가 발생했습니다.");
                }

                try {
                    // 이미지 정보 삭제
                    await boardImg.destroy({
                        where: {
                            path: img,
                        },
                    });
                    console.log(`이미지 정보 ${img} 삭제 완료`);
                } catch (error) {
                    console.error(`이미지 정보 ${img} 삭제 중 오류:`, error);
                    return res.status(500).send("이미지 정보 삭제 중 오류가 발생했습니다.");
                }

                // 모든 이미지 처리 완료 후 성공 응답 전송
                if (img === imgNames[imgNames.length - 1]) {
                    res.status(200).send("파일이 성공적으로 삭제되었습니다.");
                }
            });
        }
    } catch (error) {
        console.error("이미지 파일 삭제 중 오류:", error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
};
