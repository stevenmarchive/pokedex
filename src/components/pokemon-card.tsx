import React, { FunctionComponent, useState } from 'react';
import Pokemon from '../data/pokemon';
import './pokemon-card.css';
import formatType from '../couleur/CouleurType';
import { useHistory } from 'react-router-dom';

  
type Props = {
pokemon: Pokemon,
borderColor?:string // ? => Variable facultative
};
  
const PokemonCard: FunctionComponent<Props> = ({pokemon, borderColor='#009688'}) => {
const [color, setColor]=useState<string>();
const history = useHistory(); // Historique du navigateur
const showBorder=()=>{setColor(borderColor);}   
const hideBorder=()=>{setColor('#f5f5f5')}; // Bordure en gris
const goToPokemon=(id:number)=>{history.push(`/pokemon/${id}`);} // Ajoute une nouvelle entrée dans l'historique de navigation et affiche la page du Pokémon.

return (
<div className="col s6 m4" onClick={()=>goToPokemon(pokemon.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
    <div className="card horizontal" style={{borderColor:color}}>
        <div className="card-image"> <img src={pokemon.picture} alt={pokemon.name}/></div>
        <div className="card-stacked">
          <div className="card-content">
            <p>{pokemon.name}</p>
            {pokemon.types.map(type=>(<span key={type} className={formatType(type)}>{type}</span>))} {/* Affichage des types de pokémon et couleur */}
            </div>
        </div>
    </div> 
</div>
);

}

  
export default PokemonCard;