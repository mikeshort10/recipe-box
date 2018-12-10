import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import {
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Panel,
  Button,
  Form,
  ButtonGroup,
  PanelGroup,
  FormGroup
} from 'react-bootstrap';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

//Redux

const EDIT = 'EDIT';

const DELETE = 'DELETE';

const REQUESTING_DATA = 'REQUESTING_DATA';

const RECEIVED_DATA = 'RECEIVED_DATA';

const addRecipe = (recipe, index) => {
  return {
    type: EDIT,
    recipe: recipe,
    index: index
  }
}

const deleteRecipe = (index) => {
  return {
    type: DELETE,
    index: index
  }
}

const requestingData = () => {
  return {
    type: REQUESTING_DATA
  }
}

const receivedData = (data) => {
  return {
    type: RECEIVED_DATA,
    recipes: data.recipes
  }
}

console.log(window.localStorage)

const recipeReducer = (state = JSON.parse(window.localStorage.getItem('recipes')) || { recipes : [] }, action) => {
  let recipes = [...state.recipes]
  switch (action.type) {
    case REQUESTING_DATA:
      return state.recipes;
    case RECEIVED_DATA:
      return action.recipes;
    case EDIT:
      recipes.splice(action.index, 1, action.recipe)
      window.localStorage.setItem('recipes', JSON.stringify({ recipes : recipes }))
      return {recipes: recipes};
    case DELETE:
      recipes.splice(action.index, 1)
      window.localStorage.setItem('recipes', JSON.stringify({ recipes : recipes }))
      return {recipes: recipes};
    default:
      return state;
  }
}


const store = createStore(recipeReducer)

//React

function Ingredient(props) {
  let ing = props.ingredient;
  return (
    <ListGroupItem>
      {ing.amount +
        " " +
        ing.measurement +
        " of " +
        ing.name}
    </ListGroupItem>
  );
}

class Recipe extends Component {
  ingredients() {
    let arr = [];
    let ing = this.props.recipe.ingredients;
    for (let i = 0; i < ing.length; i++) {
      arr.push(<Ingredient ingredient={ing[i]} key={i} />);
    }
    return arr;
  }

  render() {
      return (
      <Panel eventKey={this.props.eventKey}>
        <Panel.Heading className="text-center">
         <Panel.Title toggle>{this.props.recipe.name}</Panel.Title>
        </Panel.Heading>
         <Panel.Body collapsible>
            <ListGroup>
              {this.ingredients()}
            </ListGroup>
            <Button
              vertical="true"
              block
              bsStyle="primary"
              onClick={() => this.props.selectRecipe()}
            >
              <i className="fas fa-pen-square" /> Edit
            </Button>
          </Panel.Body>
      </Panel>
    );
  }
}

function IngredientEdit(props) {
  return (
    <Form inline>
    <FormGroup validationState={props.error && props.ingredient.amount <= 0 ? "error" : null}>
      <FormControl
        className="text-center"
        type="number"
        min="0"
        value={props.ingredient.amount}
        name={props.number + "amount"}
        onChange={props.editRecipe}
      />
      </FormGroup>
      <FormGroup>
      <select value={props.ingredient.measurement} name={props.number + "measurement"} className="form-control" onChange={props.editRecipe}>
        <option name="c">c</option>
        <option name="tbsp">tbsp</option>
        <option name="tsp">tsp</option>
        <option name="oz">oz</option>
      </select>
      </FormGroup>
      <FormGroup validationState={props.error && !props.ingredient.name ? "error" : null}>
      <FormControl
        className="text-center"
        type="text"
        value={props.ingredient.name}
        name={props.number + "name"}
        onChange={props.editRecipe}
      />
      </FormGroup>
      <FormGroup>
      <Button bsStyle="danger" onClick={props.deleteIngredient}>
        <i className="fa fa-trash" />
      </Button>
      </FormGroup>
  </Form>
  );
}

class RecipeEdit extends Component {
  editAllIngredients() {
    let arr = [];
    for (let i = 0; i < this.props.recipe.ingredients.length; i++) {
      arr.push(
        <IngredientEdit
          ingredient={this.props.recipe.ingredients[i]}
          key={i}
          changeName={() => this.props.changeName(i)}
          number={i}
          editRecipe={() => this.props.editRecipe()}
          deleteIngredient={() => this.props.deleteIngredient(i)}
          error = {this.props.error}
        />
      );
    }
    return arr;
  }

  render() {
    return (
      <Panel className="panel">
        <Form>
        <InputGroup>
          <InputGroup.Addon>Name</InputGroup.Addon>
          <FormGroup validationState={this.props.error && this.props.recipe.name === "" ? "error" : null}>
          <FormControl
            className="text-center"
            value={this.props.recipe.name}
            name="name"
            onChange={() => this.props.editRecipe()}
          />
          </FormGroup>
        </InputGroup>
        </Form>
        <Panel>
          <Panel.Body>
            {this.editAllIngredients()}
            <Button bsStyle="success" onClick={this.props.addIngredient} vertical="true" block>
              Add Ingredient
            </Button>
          </Panel.Body>
        </Panel>
        <Panel.Footer>
          <ButtonGroup className="flex-row-justify">
            <ButtonGroup className="single-row-fill">
              <Button bsStyle="danger" onClick={() => this.props.deleteRecipe()}>
                Delete
              </Button>
            </ButtonGroup>
            <ButtonGroup className="single-row-fill">
              <Button bsStyle="success" onClick={() => this.props.saveRecipe()}>
                Save
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </Panel.Footer>
      </Panel>
    );
  }
}

class Presentational extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listView: true,
      error: false
    };
    this.editRecipe = this.editRecipe.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
  }

  viewAllRecipes() {
    let arr = [];
    for (let i = 0; i < this.props.recipes.length; i++) {
      arr.push(
        <Recipe
          recipe={this.props.recipes[i]}
          headId={"head" + i}
          bodyId={"body" + i}
          key={i}
          eventKey={i}
          selectRecipe={() => this.selectRecipe(i)}
        />
      );
    }
    return arr;
  }

  selectRecipe(num) {
    let recipes = [...this.props.recipes];
    let newRecipe = {
      name: "",
      ingredients: [
        {
          name: "",
          amount: "",
          measurement: ""
        }
      ]
    };
    if (num == this.props.recipes.length) recipes.push(newRecipe);
    else newRecipe = this.props.recipes[num];
    this.setState({
      editableRecipe: newRecipe,
      selectedRecipe: num,
      recipes: recipes,
      listView: !this.state.listView
    });
  }

  saveRecipe(num) {
    let recipes = [...this.props.recipes];
    let editableRecipe = Object.assign({}, this.state.editableRecipe);
    let error = false;
    if (editableRecipe.name === "") error = true;
    let ing = editableRecipe.ingredients;
    for (let i = 0; i < ing.length; i++) {
      if (ing.name === "" || ing.amount <= 0) error = true;
    }
    if (error) {
      alert('Please fill in all required fields');
      this.setState({
        error: error
      })
    } else {
    this.props.addNewRecipe(editableRecipe, num);
    this.setState({
      error: error,
      editableRecipe: undefined,
      recipes: recipes,
      selectedRecipe: undefined,
      listView: !this.state.listView
    });
    }
  }

  editRecipe() {
    let t = window.event.target;
    let n = t.getAttribute("name");
    let editableRecipe = Object.assign({}, this.state.editableRecipe);
    if (n === "name") editableRecipe.name = t.value;
    else {
      editableRecipe.ingredients[n[0]][n.slice(1)] = t.value;
    }
    this.setState({
      editableRecipe: editableRecipe
    });
  }

  deleteRecipe(num) {
    this.props.deleteSomeRecipe(num);
    this.setState({
      listView: true,
      selectedRecipe: -1
    });
  }

  addIngredient() {
    let editableRecipe = Object.assign({}, this.state.editableRecipe);
    editableRecipe.ingredients.push({
      name: "",
      measurement: "c",
      amount: "1"
    });
    this.setState({
      editableRecipe: editableRecipe
    });
  }

  deleteIngredient(num) {
    let editableRecipe = Object.assign({}, this.state.editableRecipe);
    editableRecipe.ingredients.splice(num, 1);
    this.setState({
      editableRecipe: editableRecipe
    });
  }

  componentDidMount () {
    let editableRecipe;
    let listView = true;
    if (this.props.recipes.length < 1) {
      listView = false;
      editableRecipe = {
        name: '',
        ingredients: [
          {
            name: '',
            measurement: 'tsp',
            amount: 1
          }
          ]
      }
    }
    this.setState({
      listView: listView,
      editableRecipe: editableRecipe
    })
  }

  render() {
    if (this.state.listView) {
      return (
        <PanelGroup 
        accordion 
        id="recipeList"
        >
          {this.viewAllRecipes()}
          <Panel>
            <Button
              bsStyle="success"
              className="add-button"
              onClick={() => this.selectRecipe(this.props.recipes.length)}
            >
              Add Recipe
            </Button>
          </Panel>
        </PanelGroup>
      );
    } else {
      return (
        <RecipeEdit
          recipe={this.state.editableRecipe}
          saveRecipe={() => this.saveRecipe(this.state.selectedRecipe)}
          deleteRecipe={() => this.deleteRecipe(this.state.selectedRecipe)}
          editRecipe={() => this.editRecipe()}
          deleteIngredient={num => this.deleteIngredient(num)}
          addIngredient={this.addIngredient}
          error = {this.state.error}
        />
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {recipes: state.recipes}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewRecipe: (recipe, index) => {
      dispatch(addRecipe(recipe, index))
    },
    deleteSomeRecipe: (index) => {
      dispatch(deleteRecipe(index))
    }
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    )
  }
}

export default App;
