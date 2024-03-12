const { user, course } = require("../models");
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

exports.main = async (req, res) => {
    let courseList = await course.findAll();
    res.render("user/signin", { courseList: courseList });
};

exports.duplicateCheck = async (req, res) => {
    // console.log("req.query ::", req.query);
    // console.log("req.query.u_id ::", req.query.u_id);
    const { u_id, nk_name } = req.query;
    let idCheck, nkNameCheck;
    try {
        if (u_id) {
            idCheck = await user.findOne({
                where: { u_id: u_id },
            });
        } else if (nk_name) {
            nkNameCheck = await user.findOne({
                where: { nk_name: nk_name },
            });
        }
        // console.log("idCheck ::", idCheck, "nkNameCheck ::", nkNameCheck);
        idCheck || nkNameCheck ? res.send({ isDuplicate: true }) : res.send({ isDuplicate: false });
    } catch (error) {
        console.log("Cuser duplicateCheck err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.signup = async (req, res) => {
    try {
        const { u_id, pw, name, nk_name, email, phone, cs_id } = req.body;

        if (!u_id || !pw || !name || !nk_name || !email || !phone || !cs_id) {
            return res.send({ success: false, msg: "입력칸을 모두 채워주세요." });
        }

        await user.create({
            u_id,
            pw: hashPw(pw),
            name,
            nk_name,
            email,
            phone,
            cs_id,
        });
        res.send(
            '회원가입 성공! 환영합니다 🎉 \n수강중인 학생 또는 관계자 권한 확인 후 "예약 하기", "커뮤니티" 이용 가능합니다.',
        );
    } catch (error) {
        console.log("signup controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.signin = async (req, res) => {
    try {
        const { u_id, pw } = req.body;
        const isUser = await user.findOne({ where: { u_id } });

        // 회원 정보 없는 경우
        if (!isUser) return res.send({ success: false });

        const { nk_name, permission } = isUser;
        // console.log("isUser ::", isUser);

        // 회원이면 비밀번호 일치 여부 확인
        if (isUser && comparePw(pw, isUser.pw)) {
            // 세션 생성
            req.session.u_id = u_id;
            req.session.nk_name = nk_name;
            req.session.permission = permission;
            res.send({ success: true });
            // console.log("req.session ::", req.session);
        } else res.send({ success: false });
    } catch (error) {
        console.log("signin controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.session && req.session.u_id) {
            req.session.destroy(() => {
                res.send({ msg: "로그아웃 되었습니다." });
            });
        } else {
            // 세션 만료된 회원
            res.send({ msg: "이미 세션이 만료되었습니다." });
        }
    } catch (error) {
        console.log("logout controller err :: ", error);
        res.status(500).send("server error!");
    }
};

exports.deleteUser = async (req, res) => {
    const { u_id, pw } = req.body;
    console.log("u_id ::", u_id, "pw ::", pw);
    try {
        // console.log("req.session.u_id ::", req.session.u_id);
        if (!req.session.u_id) return res.send("탈퇴 권한이 없습니다. 로그인 후 이용해주세요.");

        if (u_id !== req.session.u_id) return res.send("아이디를 정확하게 입력해주세요.");

        const isUser = await user.findOne({ where: { u_id } });

        if (!comparePw(pw, isUser.pw)) return res.send("비밀번호가 일치하지 않습니다.");
        if (isUser && comparePw(pw, isUser.pw)) {
            await user.destroy({ where: { u_id } });
            await req.session.destroy(() => {
                return res.send({ success: true, msg: "회원 탈퇴" });
            });
        }
    } catch (error) {
        console.log("deleteUser controller err :: ", error);
        res.status(500).send("server error!");
    }
};
