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
