       async function course_update(cs_id){
            const course_name=document.getElementById(`course_${cs_id}`).value
            const confirmResult=confirm('수업 이름을 변경 하시겠습니까?')
            if(confirmResult){
                const res=await axios({
                method: "patch",
                url:'/admin/courseupdate',
                data:{
                    cs_id:cs_id,
                    course_name:course_name
                }
            })
            if(res.data===true){
                alert('수업 이름이 변경되었습니다.')
                location.reload();
            }else{
                alert('수업 이름변경이 실패하였습니다.')
            }
            }else{
                alert('변경을 취소 하였습니다.')
            }
           
        }