import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Pokemon from '../data/pokemon';
import ColorType from '../couleur/CouleurType';
import requete from '../serveur/requete';
import Loader from '../components/loader';
  
type Params = { id: string }; // Identifiant récupéré depuis l'URL
  
const PokemonsDetail: FunctionComponent<RouteComponentProps<Params>> = ({ match }) => { 
// PokemonsDetail accepte les propriétés de RouteComponentProps<Params>,
// match contient des informations sur la route actuelle, y compris les paramètres de la route
    
const [pokemon, setPokemon] = useState<Pokemon|null>(null); 
//useState => hook qui permet de créer un état local peut être utilisé pour stocker des données qui peuvent être
// modifiées au cours du temps et qui déclenchent une mise à jour du composant lorsqu'elles sont modifiées.
  
useEffect(() => {
  requete.getPokemon(+match.params.id).then(pokemon=>setPokemon(pokemon));
},[match.params.id]);
    
  return (
    <div>
      { pokemon ? ( // Vérifie qu'on a bien trouvé l'id pokémon paramétrer avec l'URL
        <div className="row">
          <div className="col s12 m8 offset-m2"> 
            <h2 className="header center">{ pokemon.name }</h2>
            <div className="card hoverable"> 
              <div className="card-image">
                <img src={pokemon.picture} alt={pokemon.name} style={{width: '250px', margin: '0 auto'}}/>
                <Link to={`/pokemons/edit/${pokemon.id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                  <i className="material-icons">edit</i>
                </Link>
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <table className="bordered striped">
                    <tbody>
                      <tr> 
                        <td>Nom</td> 
                        <td><strong>{ pokemon.name }</strong></td> 
                      </tr>
                      <tr> 
                        <td>Points de vie</td> 
                        <td><strong>{ pokemon.hp }</strong></td> 
                      </tr> 
                      <tr> 
                        <td>Dégâts</td> 
                        <td><strong>{ pokemon.cp }</strong></td> 
                      </tr> 
                      <tr> 
                        <td>Types</td> 
                        <td>
                          {pokemon.types.map(type => (
                           <span key={type} className={ColorType(type)}>{type}</span>
                          ))}</td> 
                      </tr> 
                    </tbody>
                  </table>
                </div>
                <div className="card-action">
                  <Link to="/">Retour</Link> {/* Redirection de l'utilisateur */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h4 className="center"><Loader/></h4> // Si aucun pokémon est trouvé
      )}
    </div>
  );
}
  
export default PokemonsDetail;