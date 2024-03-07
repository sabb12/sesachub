/// 예약 정보 삭제
function deleteButton(btn, r_id, u_id) {
    axios({
        method: "DELETE",
        url: "/profile/reservation",
        data: { r_id: r_id, u_id: u_id },
    })
        .then(function (res) {
            btn.parentElement.remove();
        })
        .catch((error) => {
            console.error("Error deleting reservation:", error);
            // Handle error or show a message to the user
        });
}
