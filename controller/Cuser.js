const { user } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원가입 >> 해시값 생성
function hashPw(pw) {
    return bcrypt.hashSync(pw, saltRounds);
}
// 로그인 >> 해시값(hashPw) 일치 확인
function comparePw(inputPw, hashedPw) {
    return bcrypt.compareSync(inputPw, hashedPw);
}

exports.main = (req, res) => {
    res.render("user/signin");
};

exports.signup = async (req, res) => {
    try {
        const { u_id, pw, name, nk_name, email, phone, study_class, permission } = req.body;
        const duplicateCheck = await user.findOne({
            where: { u_id },
        });
        if (!duplicateCheck) {
            const signup = await user
                .create({
                    u_id,
                    pw: hashPw(pw),
                    name,
                    nk_name,
                    email,
                    phone,
                    study_class,
                    permission,
                })
                .then(() => {
                    res.send("회원가입 성공");
                });
        } else {
            res.send("중복 id");
        }
    } catch (error) {
        console.log("signup controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.signin = async (req, res) => {
    try {
        const { u_id, pw } = req.body;
        const isUser = await user.findOne({ where: { u_id } });
        if (isUser && comparePw(pw, isUser.pw)) res.send("로그인 성공");
        else res.send("로그인 실패");
    } catch (error) {
        console.log("signin controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { u_id, pw } = req.body;
        const isUser = await user.findOne({ where: { u_id } });
        if (isUser && comparePw(pw, isUser.pw)) {
            const isDelete = await user.destroy({ where: { u_id } }).then(() => {
                res.send("회원 탈퇴");
            });
        } else {
            res.send("아이디와 비밀번호를 다시 입력해주세요.");
        }
    } catch (error) {
        console.log("deleteUser controller err :: ", error);
        res.status(500).send("server error!");
    }
};
