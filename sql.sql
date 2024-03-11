-- Active: 1708305077534@@127.0.0.1@3306@sesac
use sesac;
desc user;
INSERT INTO user (u_id,pw,name,nk_name,email,phone,cs_id,`createdAt`,`updatedAt`) VALUES('user222','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test2','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test3','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test4','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test5','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test6','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test7','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test8','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test9','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
INSERT INTO user (u_id,pw,name,nk_name,email,phone,course,`createdAt`,`updatedAt`) VALUES('test15','1234','유스','새싹허브','user@mail','1234',1,NOW(),now());
SELECT * from `user`;
desc reservation;
update `user` set phone='010-111-1111' WHERE u_id='user3';
desc board;
SELECT u_id, nk_name, email, course FROM user WHERE u_id='user3';
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요1111122222222222222222','반갑습니다1111111111111111111','study',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요1','반갑습니다1','study',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요2','반갑습니다2','study',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요3','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요e','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요353234','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요4','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요5','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요6','반갑습니다3','employ',now(),now());
INSERT INTO board (u_id,title,content,category,`createdAt`,`updatedAt`) VALUES('user222','안녕하세요7','반갑습니다3','employ',now(),now());
SELECT*FROM board;
SELECT*FROM board_like;
SELECT COUNT(*) FROM board_like WHERE board_like.b_id=3;
INSERT INTO board_like (b_id,u_id)VALUES(1,"user2");
select COUNT(*) as like_count from board_like WHERE 4=4;

desc COMMENT;


INSERT INTO comment (b_id,nk_name,content,`createdAt`,`updatedAt`)VALUES(6,'user2','잘보',now(),now());
INSERT INTO comment (b_id,nk_name,parent_id,content,`createdAt`,`updatedAt`)VALUES(5,'user2',4,'잘보',now(),now());
SELECT* FROM comment;
SELECT* FROM comment WHERE comment.parent_id=3;

SELECT * FROM comment WHERE b_id=3;
SELECT * from reservation;
SELECT * from reservation WHERE day='2024-03-05' AND st_room='소회의실' ;
select * from comment WHERE parent_id=1;

INSERT INTO bookmark(u_id,b_id) VALUES('user',1);
SELECT * from bookmark ;

select * from reservation WHERE u_id='admin';
select * from reservation WHERE day='2024-3-7'AND st_room='대회의실';

SELECT * from course;
-- 과목더미
INSERT INTO course (course_name) VALUES ("python 데이터분석 및 ai/딥러닝 full PKG 개발과정");
INSERT INTO course (course_name) VALUES ("오픈소스 AI 플랫폼을 활용한 인공지능서비스 개발자 양성과정");
INSERT INTO course (course_name) VALUES ("LLM 활용 인공지능(NLP) 서비스 개발자 양성과정");
INSERT INTO course (course_name) VALUES ("기획부터 배포까지 협업 프로젝트로 완성하는 풀스택 웹 개발자 취업 부트캠프");
INSERT INTO course (course_name) VALUES ("디지털 전환을 주도하는 SW AI 교육전문가 취업스쿨 1기");
INSERT INTO course (course_name) VALUES ("[AWS 부트캠프] 클라우드 아키텍트 플러스");
INSERT INTO course (course_name) VALUES ("웹툰 제작사 취업 (연출/작가) 과정");
INSERT INTO course (course_name) VALUES ("iOS 앱 개발자 데뷔과정 PLUS");
INSERT INTO course (course_name) VALUES ("언리얼 엔진과 생성형 AI를 활용한 콘텐츠 개발자 양성 과정");
INSERT INTO course (course_name) VALUES ("기타 및 SeSAC 관계자");