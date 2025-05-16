// // 📌 1. Binding in the render method (Not recommended due to performance issues)
// class Demo extends React.Component {
//     constructor() {
//       super();
//       this.state = { message: "Hello" };
//     }
  
//     clickHandler() {
//       console.log(this.state.message);
//     }
  
//     render() {
//       return (
//         <button onClick={this.clickHandler.bind(this)}>Click Me</button>
//       );
//     }
//   }
  
//   // 📌 2. Using arrow function in render (Not recommended, creates new function each time)
//   class Demo extends React.Component {
//     constructor() {
//       super();
//       this.state = { message: "Hello" };
//     }
  
//     clickHandler() {
//       console.log(this.state.message);
//     }
  
//     render() {
//       return (
//         <button onClick={() => this.clickHandler()}>Click Me</button>
//       );
//     }
//   }
  
//   // 📌 3. Binding in constructor (✅ Recommended for class components)
//   class Demo extends React.Component {
//     constructor() {
//       super();
//       this.state = { message: "Hello" };
//       this.clickHandler = this.clickHandler.bind(this); // Binding once in constructor
//     }
  
//     clickHandler() {
//       console.log(this.state.message);
//     }
  
//     render() {
//       return (
//         <button onClick={this.clickHandler}>Click Me</button>
//       );
//     }
//   }
  
//   // 📌 4. Using arrow function as class property (✅ Most recommended and modern)
//   class Demo extends React.Component {
//     constructor() {
//       super();
//       this.state = { message: "Hello" };
//     }
  
//     clickHandler = () => {
//       console.log(this.state.message);
//     }
  
//     render() {
//       return (
//         <button onClick={this.clickHandler}>Click Me</button>
//       );
//     }
//   }
  