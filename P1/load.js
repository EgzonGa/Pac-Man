//init
var ghost_list = []
var starting_position = 300
var starting_y_position = 100
var walls = []
var nodes = new Set()

class node {
    constructor(x, y, connecting_nodes = []){
        this.x = x
        this.y = y
        this.connecting_nodes = connecting_nodes
    }
}

class wall {
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class GameObject {
    constructor(x, y, image){
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = image
    }
    draw(width = this.image.width, height = this.image.height){
        ctx.drawImage(this.image, this.x - width/2, this.y - height/2, width, height)
    }
}

class GIF extends GameObject{
    constructor(x, y, list, amt_of_lists = 1){
        super(x, y, null)
        this.original_location_x = x
        this.original_location_y = y
        this.image_list = list
        if (amt_of_lists == 1){
            for (let i = 0; i < list.length; i++){
                var image = new Image()
                image.src = list[i]
                list[i] = image
            }
        }
        else {
            for (let i = 0; i < list.length; i++){
                for (let j = 0; j < list.length; j++){
                    if (list[i][j] != undefined){
                        var image = new Image()
                        image.src = list[i][j]
                        list[i][j] = image
                    }
                }
            }
        }
        this.amt_of_lists = amt_of_lists
        this.index = 0
        this.cooldown = performance.now()
        this.degrees = 0
    }
    
     draw(){
        if (this.amt_of_lists != 1){
            if (this.degrees == 0){
                this.image_being_drawn = this.image_list[0][this.index]
            }
            else if (this.degrees == 90){
                this.image_being_drawn = this.image_list[1][this.index]
            }
            else if (this.degrees == 270){
                this.image_being_drawn = this.image_list[2][this.index]
            }
            else if (this.degrees == 180){
                this.image_being_drawn = this.image_list[3][this.index]
            }
        }
        else {
            this.image_being_drawn = this.image_list[this.index]
        }
        ctx.drawImage(this.image_being_drawn, this.x - this.image_being_drawn.width/2, this.y - this.image_being_drawn.height/2, this.image_being_drawn.width, this.image_being_drawn.height)
        if (performance.now() - this.cooldown >= 200){
            if (this.amt_of_lists == 1){
                if (this.image_list.length - 1 == this.index){
                    this.index = 0
                }
                else {
                    this.index++
                }
                this.cooldown = performance.now()
            }
            else {
                if (this.image_list.length/this.amt_of_lists == this.index){
                    this.index = 0
                }
                else {
                    this.index++
                }
                this.cooldown = performance.now()
            }
            
        }   
        
    }
    add(image){
        this.image_list.push(image)
    }
}

for (let i = starting_position; i <= starting_position + 900; i = i + 5){ //map generation
    if (i == starting_position + 200){
        for (let j = starting_y_position + 5; j < starting_y_position + 400; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    else if (i == starting_position + 250){
        for (let j = starting_y_position + 545; j > starting_y_position + 400; j = j - 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    else if (i == starting_position){
        for (let j = starting_y_position; j <= starting_y_position + 150; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
        for (let j = starting_y_position + 550; j > starting_y_position + 400; j = j - 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    else if (i == starting_position + 375){
        for (let j = starting_y_position + 5; j < starting_y_position + 400; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    else if (i == starting_position + 285){
        for (let j = starting_y_position + 185; j < starting_y_position + 270; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    if (i <= starting_position + 323 && i >= starting_position + 285){
        let j = starting_y_position + 270
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    if (i < starting_position + 375 && i >= starting_position + 285){
        let j = starting_y_position + 180
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    if (i < starting_position + 550){
        let j = starting_y_position + 400
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    else if (i == starting_position + 550){
        for (let j = starting_y_position + 400; j < starting_y_position + 475; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    if (i > starting_position + 250 && i < starting_position + 725){
        let j = starting_y_position + 475
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    else if (i == starting_position + 725){
        for (let j = starting_y_position + 475; j > starting_y_position; j = j - 5){
            if (j != starting_y_position + 200 && j != starting_y_position + 325) {
                eval('var node' + i + j + "= new node(" + i + "," + j + ")")
                eval('nodes.add(' + "node" + i + j + ')')
            }
        }
    }
    if (i > starting_position + 375 && i < starting_position + 565){
        let j = starting_y_position + 100
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    else if (i == starting_position + 565){
        for (let j = starting_y_position + 100; j <= starting_y_position + 200; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    else if (i > starting_position + 565 && i < starting_position + 900){
        let j = starting_y_position + 200
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    if (i <= starting_position + 195){
        let j = starting_y_position + 155
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
        j = starting_y_position + 280
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    if (i > starting_position + 375 && i < starting_position + 900){
        let j = starting_y_position + 325
        eval('var node' + i + j + "= new node(" + i + "," + j + ")")
        eval('nodes.add(' + "node" + i + j + ')')
    }
    if (i == starting_position + 900){
        for (let j = starting_y_position; j <= starting_y_position + 550; j = j + 5){
            eval('var node' + i + j + "= new node(" + i + "," + j + ")")
            eval('nodes.add(' + "node" + i + j + ')')
        }
    }
    if (i >= starting_position + 5 && i <= starting_position + 895) {
        eval('var node' + i + starting_y_position + "= new node(" + i + "," + starting_y_position + ")")
        eval('nodes.add(' + "node" + i + starting_y_position + ')')
        eval('var node' + i + (starting_y_position + 550) + "= new node(" + i + "," + (starting_y_position + 550) + ")")
        eval('nodes.add(' + "node" + i + (starting_y_position + 550) + ')')
    }
}
var width = 10
var displacement = 22.5
var thickness = displacement + width
walls.push(new wall(starting_position - thickness, starting_y_position - thickness, 900 + thickness * 2, width)) //outer walls
walls.push(new wall(starting_position + 900 + displacement, starting_y_position - thickness, width, 550 + thickness * 2))
walls.push(new wall(starting_position - displacement, starting_y_position + 550 + displacement, 900 + displacement * 2, width))

walls.push(new wall(starting_position + displacement, starting_y_position + displacement, width, 150 - displacement * 2)) //upper left
walls.push(new wall(starting_position - thickness, starting_y_position - thickness, width, 155 + displacement * 2 + width))
walls.push(new wall(starting_position - thickness, starting_y_position + 155 + displacement, 200 + width, width))
walls.push(new wall(starting_position + displacement, starting_y_position + 155 - thickness, 200 - displacement * 2, width))
walls.push(new wall(starting_position + displacement, starting_y_position + displacement, 200 - displacement * 2, width))
walls.push(new wall(starting_position + 200 - thickness, starting_y_position + displacement, width, 150 - displacement * 2))

walls.push(new wall(starting_position - thickness, starting_y_position + 400 - displacement, width, 150 + displacement * 2 + width)) //bottom left
walls.push(new wall(starting_position + 250 - thickness, starting_y_position + 400 + displacement, width, 150 - displacement * 2))
walls.push(new wall(starting_position - thickness, starting_y_position + 400 - thickness, 200 + width, width))
walls.push(new wall(starting_position + displacement, starting_y_position + 400 + displacement, width, 150 - displacement * 2))
walls.push(new wall(starting_position + displacement, starting_y_position + 400 + displacement, 250 - displacement * 2, width))
walls.push(new wall(starting_position + displacement, starting_y_position + 550 - thickness, 250 - displacement * 2, width))

walls.push(new wall(starting_position + 200 + displacement, starting_y_position + displacement, width, 300 + displacement * 2 + width)) //middle left
walls.push(new wall(starting_position + 200 - thickness, starting_y_position + 280 + displacement, width, 130 - thickness * 2))
walls.push(new wall(starting_position + 200 - thickness, starting_y_position + 150 + thickness, width, 120 - displacement * 2))
walls.push(new wall(starting_position - thickness, starting_y_position + 280 - thickness, 200 + width, width))
walls.push(new wall(starting_position - thickness, starting_y_position + 280 + displacement, 200 + width, width))
walls.push(new wall(starting_position - thickness, starting_y_position + 280 - displacement, width, thickness + displacement))

walls.push(new wall(starting_position + 200 + thickness, starting_y_position + displacement, 175 - thickness * 2, width)) //middle
walls.push(new wall(starting_position + 200 + thickness, starting_y_position + 400 - thickness, 175 - thickness * 2, width))
walls.push(new wall(starting_position + 375 - thickness, starting_y_position + displacement, width, 180 - displacement * 2))
walls.push(new wall(starting_position + 375 - thickness, starting_y_position + 180 + displacement, width, 220 - displacement * 2))
walls.push(new wall(starting_position + 285 - displacement, starting_y_position + 180 - thickness, 90, width))
walls.push(new wall(starting_position + 285 - thickness, starting_y_position + 180 - thickness, width, 145))
walls.push(new wall(starting_position + 285 - thickness, starting_y_position + 325 - thickness, 90, width))
walls.push(new wall(starting_position + 285 + displacement, starting_y_position + 180 + displacement, 90 - displacement * 2, width))
walls.push(new wall(starting_position + 285 + displacement, starting_y_position + 183 + displacement * 2 + width, 90 - displacement * 2, width))
walls.push(new wall(starting_position + 285 + displacement, starting_y_position + 180 + displacement + width, width, displacement + 3))

walls.push(new wall(starting_position + 375 + displacement, starting_y_position + displacement, 335 - thickness, width))//middle top
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + displacement, width, 100 - displacement * 2)) 
walls.push(new wall(starting_position + 715 - displacement, starting_y_position + displacement, width, 200 - displacement * 2))
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 100 - thickness, 190, width)) 
walls.push(new wall(starting_position + 565 + displacement, starting_y_position + 100 - thickness, width, 100 + width))
walls.push(new wall(starting_position + 565 + displacement, starting_y_position + 100 - thickness, width, 100 + width))
walls.push(new wall(starting_position + 565 + displacement, starting_y_position + 200 - thickness, 100 + width, width))

walls.push(new wall(starting_position + 715 + thickness, starting_y_position + displacement, width, 200 - displacement * 2)) //top right
walls.push(new wall(starting_position + 900 - thickness, starting_y_position + displacement, width, 200 - displacement * 2))
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + displacement, 125, width))
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 200 - thickness, 125, width))

walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 200 + displacement, width, 125 - displacement * 2)) //middle right
walls.push(new wall(starting_position + 900 - thickness, starting_y_position + 200 + displacement, width, 125 - displacement * 2))
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 200 + displacement, 125, width))
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 325 - thickness, 125, width))

walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 475 + displacement, width, 15 + width))//bottom right
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 325 + displacement, 125, width)) 
walls.push(new wall(starting_position + 715 + thickness, starting_y_position + 325 + displacement, width, 150 + width))
walls.push(new wall(starting_position + 900 - thickness, starting_y_position + 325 + displacement, width, 225 - displacement * 2))
walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 550 - thickness, 650 - displacement * 2, width))
walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 475 + displacement, 475 + width, width))

walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 400 + displacement, width, 75 - displacement * 2)) //middle bottom
walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 400 + displacement, 300 - displacement * 2, width))
walls.push(new wall(starting_position + 550 - thickness, starting_y_position + 400 + displacement, width, 75 - displacement * 2))
walls.push(new wall(starting_position + 250 + displacement, starting_y_position + 475 - thickness, 300 - displacement * 2, width))

walls.push(new wall(starting_position + 715 - displacement, starting_y_position + 325 + displacement, width, 150 - displacement * 2)) //more middle bottom
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 325 + displacement, 335 - thickness, width)) 
walls.push(new wall(starting_position + 550 + displacement, starting_y_position + 475 - thickness, 175 - displacement * 2, width))
walls.push(new wall(starting_position + 550 + displacement, starting_y_position + 400 - displacement, width, 75 - width))
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 400 - thickness, 175 + width, width)) 
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 325 + displacement, width, displacement)) 

var ghost_wall = new wall(starting_position + 375 + thickness, starting_y_position + 100 + displacement, 180 - displacement * 2, width) //Red wall
walls.push(ghost_wall)

walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 100 + displacement, width, 225 - displacement * 2)) //Ghost Cage
walls.push(new wall(starting_position + 375 + displacement, starting_y_position + 325 - thickness, 350 - displacement * 2, width))
walls.push(new wall(starting_position + 725 - thickness, starting_y_position + 200 + displacement, width, 125 - displacement * 2))
walls.push(new wall(starting_position + 565 - thickness, starting_y_position + 200 + displacement, 160 + width, width))
walls.push(new wall(starting_position + 565 - thickness, starting_y_position + 100 + displacement, width, 100))



