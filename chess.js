
import { Chess } from 'chess.js'


const chess = new Chess()
console.log(chess.moves({ square: 'e2' }))
console.log(chess.ascii())
chess.move('e4')
console.log(chess.moves())
chess.move('e5')
console.log(chess.moves())
chess.move('f4')
console.log(chess.moves())
console.log(chess.ascii())
// while (!chess.isGameOver()) {
//     const moves = chess.moves()
//     const move = moves[Math.floor(Math.random() * moves.length)]
//     chess.move(move)
//     console.log(moves)
//     console.log(move)
//     console.log(chess.ascii())
// }
// console.log(chess.pgn())


