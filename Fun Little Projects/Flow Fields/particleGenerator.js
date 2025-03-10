const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.fillStyle = 'white'

class Particle {
        //! taking effect class as a paramater
    constructor(effect) {
        this.effect = effect
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
    }
        //!draws a rectangle    //!takes context as paramenter
    draw(context) {
        context.fillRect(this.x, this.y, 10, 10)
    }
}

class Effect {
    constructor(width,height) {
        this.width = width
        this.height = height
        this.particles = []
        this.numberOfParticles = 50
    }

    init() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))     //!pushes or adds a new rectangle to particles array
        }                             //! takes whole Effect class as parameter as specified in its constructor
    }

    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context)      //!for each particle in particles array it draws a rectangle
        })
    }

}

const effect = new Effect(canvas.width, canvas.height)
effect.init()
effect.render(ctx)
console.log(effect);