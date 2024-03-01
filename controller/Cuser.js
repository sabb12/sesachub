const { user } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원가입 >> 해시값 생성
function hashPw(pw) {
    return bcrypt.hashSync(pw, saltRounds);
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
