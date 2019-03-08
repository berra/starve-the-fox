import { repeat, head, equals } from "ramda";
import { Trace } from "./traceComponent";
import { Card, CardPlaceholder } from "./cardComponent";
import { getRulesHtml } from "./rules";
import { playerNum } from "./game";

/** state -> viewProps */
const mapStateToView = ({ gameOver, hands, playerTurn, trace }) => ({
  gameOver,
  hands,
  trace,
  isPlayer: equals(0, playerTurn)
});

export function createMarkup(state) {
  const { gameOver, hands, trace, isPlayer } = mapStateToView(state);

  return `
    <div class="game">
      <header role="banner">
         <div>
          <button class="btn" data-reset>New game</button>
          <button class="btn" ${
            gameOver || !isPlayer ? "disabled" : ""
          } data-play>
            Play
          </button>
         </div>
         <div>
          ${gameOver !== "" ? `<span>${gameOver}</span>` : ""}
         </div>
         
      </header>

      <aside>
        <ul>
          ${Trace(trace)}
        </ul>
      </aside>

      <main role="main" id="main">
        
      ${hands
        .map((hand, idx) => {
          const playedCards = state.pile[idx];
          return `
        <div class="pile pile--player">
          <span class="bubble"><small>Spelare ${playerNum({
            playerTurn: idx
          })}</small> ${hand.length}</span>
          ${repeat('<div class="card card--back"></div>', hand.length).join("")}
        </div>
        <div class="pile">
           <span class="bubble">${playedCards.length}</span>
          ${
            playedCards.length > 0 ? Card(head(playedCards)) : CardPlaceholder()
          }
          
        </div>
        `;
        })
        .join("")}
      </main>
      <footer>
        ${getRulesHtml()}
        <h2>Varför?</h2>
        <p>Detta är byggt som en övning i funktionell programmering med ramverket <a href="https://ramdajs.com/">Ramda</a>.</p>
        <h2>Nästa steg</h2>
        <p>Göra p2p multiplayer med webrtc messaging. Stödja tre och fyra spelare.</p>
      </footer>
      
    </div>
  `;
}
