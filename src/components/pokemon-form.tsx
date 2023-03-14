import React, { FunctionComponent, useState } from 'react';
import Pokemon from '../data/pokemon';
import ColorType from '../couleur/CouleurType';
import { useHistory } from 'react-router-dom';
import requete from '../serveur/requete';

type Props = {pokemon: Pokemon,isEditForm:boolean};
type Field={value: any, error?:string, isValid?:boolean};
type Form = {picture:Field,name:Field, hp:Field, cp:Field, types:Field};
  
const PokemonForm: FunctionComponent<Props> = ({pokemon,isEditForm}) => {

const [form, setForm]= useState<Form>({
picture:{value:pokemon.picture},
name:{value:pokemon.name, isValid:true},
hp:{value:pokemon.hp, isValid:true},
cp:{value:pokemon.cp, isValid:true},
types:{value:pokemon.types, isValid:true},
});

const history = useHistory();
  
  const types: string[] = [
    'Plante', 'Feu', 'Eau', 'Insecte', 'Normal', 'Electrik',
    'Poison', 'Fée', 'Vol', 'Combat', 'Psy'
  ];

const hasType = (type:string): boolean=>{return form.types.value.includes(type)}; // Coche les types du pokémon
const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{

const fieldName:string = e.target.name;
const fieldValue:string = e.target.value;
const newField: Field = { [fieldName]: { value: fieldValue }};
setForm({...form,...newField});

}

const selectType = (type:string, e:React.ChangeEvent<HTMLInputElement>):void=>{

const checked = e.target.checked;
let newField: Field;
if(checked){
    // Si l'utilisateur coche un type, à l'ajouter à la liste
    const newTypes: string[] = form.types.value.concat([type]);
    newField = {value: newTypes};
}else{
    // Si l'utilisateur décoche un type, on le retire de la liste
    const newTypes: string[] = form.types.value.filter((currentType: string)=>currentType !== type);
    newField = {value: newTypes};
}
setForm({...form, ...{types: newField}});

}

const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    
e.preventDefault();
const isFormValid=validateForm();
if(isFormValid){ // Persiste les modifications du formulaire
  pokemon.picture=form.picture.value;
  pokemon.name=form.name.value;
  pokemon.hp=form.hp.value;
  pokemon.cp=form.cp.value;
  pokemon.types=form.types.value;
  isEditForm? updatePokemon(): addPokemon(); // Vérifie si isEditForm est vrai ou faux pour savoir si on veut ajouter ou modifier un pokémon
}
}

const addPokemon=()=>{
  requete.addPokemon(pokemon).then(()=>history.push('/pokemons'));
}

const updatePokemon=()=>{
  requete.updatePokemon(pokemon).then(()=>history.push(`/pokemons`));
}

const isAddForm=()=>{ 
  return !isEditForm;
}
// Test des valeurs d'entrée de l'utilisateur avec les conditions prédéfinit
const validateForm=()=>{ 
let newForm:Form=form;

if(isAddForm()){
  const start="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/"; // Vérifie que l'url commence par cette url
  const end=".png"; // Vérifie que l'url ce termine par end
  if(!form.picture.value.startsWith(start)||!form.picture.value.endsWith(end)){ //startsWith vérifie que ça commence par un préfixe et ends suffixe
    const errorMsg:string="L'url n'est pas valide.";
    const newField:Field={value:form.picture.value,error:errorMsg,isValid:false};
    newForm={...form,...{picture:newField}};
  }else{
    const newField:Field={value:form.picture.value,error:'',isValid:true};
    newForm={...form,...{picture:newField}};
  }
}

if(!/^[a-zA-Zàéè]{3,25}$/.test(form.name.value)){
  const errorMsg:string='Le nom est entre 1 et 25 caractères.';
  const newField:Field={value:form.name.value, error:errorMsg, isValid:false};
  newForm={...newForm, ...{name:newField}};
}else{
  const newField:Field={value:form.name.value, error:'', isValid:true};
  newForm={...newForm, ...{name:newField}};
}

if(!/^[0-9]{1,3}$/.test(form.hp.value)){
  const errorMsg:string='Les points de vie sont compris entre 0 et 999.';
  const newField:Field={value:form.hp.value, error:errorMsg, isValid:false};
  newForm={...newForm, ...{hp:newField}};
}else{
  const newField:Field={value:form.hp.value, error:'', isValid:true};
  newForm={...newForm, ...{hp:newField}};
}

if(!/^[0-9]{1,2}$/.test(form.cp.value)){
  const errorMsg:string='Les points de vie sont compris entre 0 et 99.';
  const newField:Field={value:form.cp.value, error:errorMsg, isValid:false};
  newForm={...newForm, ...{cp:newField}};
}else{
  const newField:Field={value:form.cp.value, error:'', isValid:true};
  newForm={...newForm, ...{cp:newField}};
}

setForm(newForm);
return newForm.name.isValid && newForm.hp.isValid && newForm.cp.isValid;
}

const isTypesValid=(type:string):boolean=>{ // Vérification des cases du type avec les conditions prédéfinit
if (form.types.value.length === 1 && hasType(type)){ // Empêche de désélectionner la case cochée si elle est seule
  return false;
}
if (form.types.value.length >= 3 && !hasType(type)){ // Empêche de sélectionner d'autre case s'il y a 3 cases cochées
  return false;
}
return true;
}

const deletePokemon=()=>{
  requete.deletePokemon(pokemon).then(()=>history.push('/pokemons'));
}

  return (
    <form onSubmit = {e => handleSubmit(e)}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <div className="card hoverable"> 
            {isEditForm&&(
            <div className="card-image">
              <img src={pokemon.picture} alt={pokemon.name} style={{width: '250px', margin: '0 auto'}}/>
              <span className= "btn-floating halfway-fab waves-effect waves-light">
              <i onClick={deletePokemon} className="material-icons">delete</i>
              </span>
            </div>
            )}
            <div className="card-stacked">
              <div className="card-content">
                {/* Pokemon picture */}
                {isAddForm()&&(
                  <div className="form-group">
                  <label htmlFor="name">Image</label>
                  <input id="picture" name="picture" type="text" className="form-control" value={form.picture.value} onChange={e => handleInputChange(e)}></input>
                  {form.picture.error && <div className="card-panel red accent-1">{form.picture.error}</div>}
                </div>
                )}
                {/* Pokemon name */}
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input id="name" name="name" type="text" className="form-control" value={form.name.value} onChange={e => handleInputChange(e)}></input>
                  {form.name.error && <div className="card-panel red accent-1">{form.name.error}</div>}
                </div>
                {/* Pokemon hp */}
                <div className="form-group">
                  <label htmlFor="hp">Point de vie</label>
                  <input id="hp" name="hp" type="number" className="form-control"value={form.hp.value} onChange={e => handleInputChange(e)}></input>
                  {form.hp.error && <div className="card-panel red accent-1">{form.hp.error}</div>}
                </div>
                {/* Pokemon cp */}
                <div className="form-group">
                  <label htmlFor="cp">Dégâts</label>
                  <input id="cp" name="cp" type="number" className="form-control"value={form.cp.value} onChange={e => handleInputChange(e)}></input>
                  {form.cp.error && <div className="card-panel red accent-1">{form.cp.error}</div>}
                </div>
                {/* Pokemon types */}
                <div className="form-group">
                  <label>Types</label>
                  {types.map(type => (
                    <div key={type} style={{marginBottom: '10px'}}>
                      <label>
                        <input id={type} type="checkbox" className="filled-in" value={type} disabled={!isTypesValid(type)} checked={hasType(type)} onChange={e => selectType(type,e)}></input>
                        <span>
                          <p className={ColorType(type)}>{ type }</p>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-action center">
                {/* Submit button */}
                <button type="submit" className="btn">Valider</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
   
export default PokemonForm;