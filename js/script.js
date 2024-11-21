$(function () {
    // Khai báo các object
    var container = $('#container');
    var bird = $('#bird');
    var pole = $('.pole');
    var pole_1 = $('#pole_1');
    var pole_2 = $('#pole_2');
    var score = $('#score');
    var highScore = localStorage.getItem('highScore') || 0;
    $('#high_score').text(highScore);
    var levelDisplay = $('#level');

    // Chuyển các thông tin của object sang dạng số thực
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));
    var pole_initial_height = parseInt(pole.css('height'));
    var bird_left = parseInt(bird.css('left'));
    var bird_height = parseInt(bird.height());
    var speed = 10; 

    // Một số trạng thái trong game
    var go_up = false;
    var score_updated = false;
    var game_over = false;
    var current_level = 1;
    var interval = 40;
    var game_start = false;

    // Hàm cập nhật Level
    function updateLevel() {
        var current_score = parseInt(score.text());
        if (current_score >= 50) {
            stop_the_game(true); // Game thắng
        } else if (current_score >= 40) {
            current_level = 4;
            interval = 20;
        } else if (current_score >= 20) {
            current_level = 3;
            interval = 25;
        } else if (current_score >= 5) {
            current_level = 2;
            interval = 30;
        }

        // Cập nhật giao diện
        levelDisplay.text('Level: ' + current_level);
    }

    // Hàm bắt đầu game
    function playGame() {
        // Realtime cho game 
        var the_game = setInterval(function () {
            if (collision(bird, pole_1) || // Nếu chú chim va chạm với ống trên
                collision(bird, pole_2) || // Hoặc chú chim va chạm với ông dưới
                parseInt(bird.css('top')) <= 0 || // Hoặc chú chim va chạp với khung game trên
                parseInt(bird.css('top')) > container_height - bird_height // Hoặc chú chim va chạm với khung game dưới
                )
            {
                stop_the_game(); // Chạy hàm thua game
                function stop_the_game() {
                    clearInterval(playGame()); // Xoá realtime chơi game
                    game_over = true;
                
                    // Lấy điểm hiện tại
                    var currentScore = parseInt(score.text());
                
                    // Cập nhật High Score nếu điểm hiện tại cao hơn
                    if (currentScore > highScore) {
                        highScore = currentScore;
                        localStorage.setItem('highScore', highScore);
                        $('#high_score').text(highScore);
                    }
                
                    $('#restart_btn').slideDown(); // Hiện nút chơi lại
                }
            }
            else
            {
                // Lấy vị trị hiện tại của ống nước
                var pole_current_position = parseInt(pole.css('right'));
                // Cập nhập điểm khi chú chim vượt qua 1 cặp ống
                if (pole_current_position > container_width - bird_left)
                {
                    if (score_updated === false)
                    {
                        score.text(parseInt(score.text()) + 1); // Cộng 1 điểm
                        score_updated = true;
                        updateLevel(); // Kiểm tra và cập nhật Level
                        clearInterval(the_game); // Xóa interval cũ
                        playGame(); // Tạo interval mới với tốc độ mới
                    }
                }

                // Kiểm tra các ống đã đi ra khỏi khung game 
                if (pole_current_position > container_width) {
                    var new_height = parseInt(Math.random() * 100); 
                    // Tạo chiều cao các ống nước ngẫu nhiên
                    pole_1.css('height', pole_initial_height + new_height);
                    pole_2.css('height', pole_initial_height - new_height);
                    score_updated = false;
                    pole_current_position = pole_initial_position; // Gán vị trị hiện tại = vị trí ban đầu của ống nước
                }

                // Di chuyển ống nước
                pole.css('right', pole_current_position + speed);

                // Nếu không điều khiển chú chim bay lên
                if (go_up === false) {
                    go_down(); // Hàm di chuyển chú chim rơi xuống
                }
            }
        }, interval);
    }

    // Khi nhả chuột ra trong khung game
    $('#container').mouseup(function (e) {    
        clearInterval(go_up); // Xoá realtime hành động bay lên cho chú chim
        go_up = false;
    });

    // Khi nhấp chuột vào trong khung game
    $('#container').mousedown(function (e) {
        if (go_up === false) {
            go_up = setInterval(up, 40);
        }
    });

    // Khi nhấn phím mũi tên xuống
    $(document).keydown(function (e) {
        if (e.key === "ArrowDown") {
            if (go_up === false) {
                go_up = setInterval(up, 40);
            }
        }
    });

    // Khi nhả phím mũi tên xuống
    $(document).keyup(function (e) {
        if (e.key === "ArrowDown") {
            clearInterval(go_up);
            go_up = false;
        }
    });

    // Khi nhấn vào Chơi game
    $('#play_btn').click(function() {
        if (game_start == false)
         {
            playGame(); // Chạy hàm bắt đầu chơi game
            $(this).hide(); // Ẩn nút chơi game
            game_start = true;
         }
    });    

    $(document).keydown(function(e) {
        if (game_start == false)
            {
        if (e.key === "ArrowDown") {
            playGame(); // Bắt đầu chơi game
            $('#play_btn').hide(); // Ẩn nút chơi game
        }
        game_start = true;
    }
    });

    // Hàm di chuyển chú chim rơi xuống
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)'); // Nghiêng object chú chim 50 độ
    }

    // Hàm di chuyển chú chim bay lên
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)'); // Nghiêng object chú chim -10 độ
    }

    // Hàm thua game
    function stop_the_game() {
        clearInterval(playGame()); // Xoá realtime chơi game
        game_over = true;
        $('#restart_btn').slideDown(); // Hiện nút chơi lại
    }

    // Khi click vào nút Chơi lại
    $('#restart_btn').click(function () {
        location.reload(); // Tải lại trang
    });

    // Hàm va chạm giữa 2 object
    function collision($div1, $div2) {
        // Khai báo các thông số của 2 object
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        // Nếu xảy ra va chạm
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        }
        // Ngược lại không va chạm
        else
        {
            return true;
        }
    }
});
