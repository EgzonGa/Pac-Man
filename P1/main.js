var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var dead = false;
var keyBeingPressed = false
var hasStarted = false
var won = false
document.addEventListener("keydown", keyDownHandler, false);
var speed = 5;
var lives = 0;
var cooldown = performance.now()
var start_timer = performance.now()
var first_loop = true
var scatter_mode = false
var scatter_cooldown = new Date()
var fruit_eaten = false
var start_audio = new Audio('Audio/pacman_beginning.wav')
var waka = new Audio('Audio/waka.wav')
var eat_fruit = new Audio('Audio/fruit.wav')
var death = new Audio('Audio/death.wav')
var victory = new Audio('Audio/Victory.m4a')
var eat_ghost = new Audio('Audio/eat_ghost.wav')
var ghost_type_list = [ghost_list, main_scatter_ghost_list, second_scatter_ghost_list]
eat_ghost.volume = 0.25
victory.volume = 0.25
death.volume = 0.25
eat_fruit.volume = 0.25
waka.volume = 0.25
start_audio.volume = 0.25

function keyDownHandler(e) {
    if (running == false){
        if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
            keyBeingPressed = "right" 
            cooldown = performance.now()
        }
        else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
            keyBeingPressed = "left"
            cooldown = performance.now()
        }
        else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s"){
            keyBeingPressed = "down"
            cooldown = performance.now()
        }
        else if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
            keyBeingPressed = "up"
            cooldown = performance.now()
        }
    }
}
function player_move(){
    try {
        if (keyBeingPressed == "right"){
            eval("var potential_node = node" + (player.x + speed) + player.y)
            eval("var can_move = nodes.has(node" + (player.x + speed) + player.y + ")")
            if (can_move && !forbidden_nodes.has(potential_node)){
                player.x += speed
                player.degrees = 90
            }
        }
        else if (keyBeingPressed == "left"){
            eval("var potential_node = node" + (player.x - speed) + player.y)
            eval("var can_move = nodes.has(node" + (player.x - speed) + player.y + ")")
            if (can_move && !forbidden_nodes.has(potential_node)){
                player.x -= speed
                player.degrees = 270
            }
        }
        else if (keyBeingPressed == "down"){
            eval("var potential_node = node" + player.x + (player.y + speed))
            eval("var can_move = nodes.has(node" + player.x + (player.y + speed) + ")")
            if (can_move && !forbidden_nodes.has(potential_node)){
                player.y += speed
                player.degrees = 180
            } 
        }
        else if (keyBeingPressed == "up"){
            eval("var potential_node = node" + player.x + (player.y - speed))
            eval("var can_move = nodes.has(node" + player.x + (player.y - speed) + ")")
            if (can_move && !forbidden_nodes.has(potential_node)){
                player.y -= speed
                player.degrees = 0
            }
        }
        if (can_move && !forbidden_nodes.has(potential_node)){
            hasStarted = true
        }
        if (forbidden_nodes.has(potential_node)) {
            throw '';
        }
    }
    catch (error) {
        if (player.degrees == 90){
            eval("var can_move = nodes.has(node" + (player.x + speed) + player.y + ")")
            if (can_move){
                player.x += speed
                player.degrees = 90
            }
        }
        else if (player.degrees == 270){
            eval("var can_move = nodes.has(node" + (player.x - speed) + player.y + ")")
            if (can_move){
                player.x -= speed
                player.degrees = 270
            }
        }
        else if (player.degrees == 180){
            eval("var can_move = nodes.has(node" + player.x + (player.y + speed) + ")")
            if (can_move){
                player.y += speed
                player.degrees = 180
            } 
        }
        else if (player.degrees == 0){
            eval("var can_move = nodes.has(node" + player.x + (player.y - speed) + ")")
            if (can_move){
                player.y -= speed
                player.degrees = 0
            }
        }
    }
}
function pathfind_dfs(node, target, list, already_visited, modified_path){
    list.push(node)
    already_visited.add(node)
    let current_node = node
    while (current_node != target){
        let amt_of_nodes = 0
        let connecting_nodes = []
        if (modified_path) {
            connecting_nodes = current_node.connecting_nodes
        }
        else {
            connecting_nodes = current_node.connecting_nodes.reverse()
        }
        for (let next_node of connecting_nodes){
            if (next_node == target){
                list.push(next_node)
                return [...list]
            }
            else if (!already_visited.has(next_node)){
                current_node = next_node
                list.push(next_node)
                already_visited.add(next_node)
                amt_of_nodes += 1
                break
            }
        }
        if (amt_of_nodes == 0 && current_node == node){
            return []
        }
        if (amt_of_nodes == 0){
            if (current_node != node){
                list.splice(list.indexOf(current_node), 1)
                current_node = list[list.length - 1]
            }
        }
    }
}

function pathfind_bfs(node, target, list, already_visited, modified_path){ 
    let current_node = node
    list.push([node])
    while (list.length > 0){
        let path = list.shift()
        current_node = path[path.length - 1]
        if (!already_visited.has(current_node)){
            if (modified_path) {
                connecting_nodes = current_node.connecting_nodes
            }
            else {
                connecting_nodes = current_node.connecting_nodes.reverse()
            }
            for (let next_node of connecting_nodes){
                if (!already_visited.has(next_node)){
                    let new_path = [...path]
                    new_path.push(next_node)
                    if (next_node == target){
                        return new_path
                    }
                    list.push(new_path)
                }
            }
            already_visited.add(current_node)
        }
    }
    return []
}


node_list = []
already_visited = new Set()
function move_ghost(ghost, target, path_algorithm){
    if (ghost.x != target.x || ghost.y != target.y){
        eval("var target_node = node" + target.x + target.y)
        eval("var ghost_node = node" + ghost.x + ghost.y)
        let shortest_path = []
        for (let node of ghost_node.connecting_nodes){ 
            if (node == target_node){
                ghost.x = target.x
                ghost.y = target.y
                break
            }
            else if (node != ghost.previous_node){
                node_list.splice(0, node_list.length)
                already_visited.clear()
                if (ghost.previous_node != null){
                    already_visited.add(ghost.previous_node)
                }
                already_visited.add(ghost_node) //can't double back to go to ghost's current position
                let path = []
                if (path_algorithm == 0){
                    path = pathfind_dfs(node, target_node, node_list, already_visited, false)
                }
                else if (path_algorithm == 1){
                    path = pathfind_dfs(node, target_node, node_list, already_visited, true)
                }
                else if (path_algorithm == 2){
                    path = pathfind_bfs(node, target_node, node_list, already_visited, false)
                }
                else {
                    path = pathfind_bfs(node, target_node, node_list, already_visited, true)
                }
                if (shortest_path.length == 0 || (shortest_path.length > path.length && path.length != 0)){
                    shortest_path = path
                }
            }
        }
        
        for (let node of shortest_path){
            if (node != ghost.previous_node && node != ghost_node){
                ghost.x = node.x
                ghost.y = node.y
                break
            }
        }
        if (ghost.previous_node != ghost_node){
            ghost.previous_node = ghost_node 
        }
            
    }
    else if (ghost.x == ghost.original_location_x && ghost.y == ghost.original_location_y && eaten_ghost_list.includes(ghost)) {
        eval("var player_node = node" + player.x + player.y)
        let i = eaten_ghost_list.indexOf(ghost)
        for (let first_ghost_list of ghost_type_list) {
            first_ghost_list[i].x = ghost.x
            first_ghost_list[i].y = ghost.y
            first_ghost_list[i].previous_node = player_node
            first_ghost_list[i].degrees = ghost.degrees
            first_ghost_list[i].scatter_node = ghost.scatter_node
            first_ghost_list[i].cooldown = performance.now() + 4000
            first_ghost_list[i].eaten = false
        }
        
    }
    else {
        let random_new_scatter_node = [...scatter_node_list]
        random_new_scatter_node.splice(scatter_node_list.indexOf(ghost.scatter_node), 1)
        ghost.scatter_node = random_new_scatter_node[[Math.floor(Math.random()*random_new_scatter_node.length)]]
    }
}

function orient_ghost(ghost_list){
    for (let i = 0; i < 4; i++){
        if (Math.abs(player.x - ghost_list[i].x) <= 6 && Math.abs(player.y - ghost_list[i].y) <= 6){
            if (!scatter_mode && !ghost_list[i].eaten){
                waka.pause()
                waka.currentTime = 0
                death.play()
                if (lives > 0){
                    start_timer = performance.now() - 2000
                    for (let ghost of ghost_list){
                        ghost.x = ghost.original_location_x
                        ghost.y = ghost.original_location_y
                        ghost.eaten = false
                    }
                    player.x = player.original_location_x
                    player.y = player.original_location_y
                    player.degrees = 270
                    keyBeingPressed = "left"
                    hasStarted = false
                    lives -= 1
                }
                else {
                    dead = true
                }
            }
            else if (!ghost_list[i].eaten) {
                for (let this_ghost_list of ghost_type_list) {
                    this_ghost_list[i].eaten = true
                }
                eat_ghost.play()
                switch_costume(eaten_ghost_list, ghost_list)
            }
        }
        let ghost = ghost_list[i]
        if (ghost_list[i].eaten){
            ghost = eaten_ghost_list[i]
        }
        if (performance.now() - ghost.cooldown >= 0){
            if (ghost.previous_node == null || ghost.previous_node.y - ghost.y > 0){
                ghost.degrees = 0
            }
            else if (ghost.previous_node.x - ghost.x < 0){
                ghost.degrees = 90
            }
            else if (ghost.previous_node.x - ghost.x > 0){
                ghost.degrees = 270
            }
            else if (ghost.previous_node.y - ghost.y < 0){
                ghost.degrees = 180
            }
            if (!scatter_mode && !ghost.eaten){
                move_ghost(ghost, player, i)
            }
            else {
                if (!ghost.eaten) {
                    move_ghost(ghost, ghost.scatter_node, i)
                }
                else {
                    eval("var original_node = node" + eaten_ghost_list[i].original_location_x + eaten_ghost_list[i].original_location_y)
                    move_ghost(eaten_ghost_list[i], original_node, i)
                }
                
            }
        }
        ghost.draw()
    }
}

function switch_costume(first_ghost_list, second_ghost_list){
    eval("var player_node = node" + player.x + player.y)
    for (let i = 0; i < 4; i++){
        first_ghost_list[i].x = second_ghost_list[i].x
        first_ghost_list[i].y = second_ghost_list[i].y
        first_ghost_list[i].previous_node = player_node
        first_ghost_list[i].degrees = second_ghost_list[i].degrees
        first_ghost_list[i].scatter_node = second_ghost_list[i].scatter_node
        first_ghost_list[i].cooldown = second_ghost_list[i].cooldown
        first_ghost_list[i].eaten = second_ghost_list[i].eaten
    }
}
