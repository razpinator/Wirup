![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/Logo.png)

## Introduction

Wirup is essentially a nano web UI framework aimed at enabling complex features like **one-way data-binding**, **routing**, **component portability**, etc. with minimal lines of code. There are more complex and established frameworks facilitating these features (and more). However, they may have steep learning curves or may be heavy. Wirup is meant to enable beginners to get up and running quickly.

Wirup will remain free (with a MIT license) and open to improvements and criticism all along the way. 

## Quick Start

1. Clone the repository.
2. Navigate to the `example` folder.
3. Run `http-server` (or any static server) to see it in action.

```bash
git clone https://github.com/razpinator/wirup.git
cd wirup/example
npx http-server .
```

That is it! 

Below is a more detailed break down of creating a similar app from scratch.

## Start in 9 Mins

![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/WirupQuickSetup.png)

### 1. Project Structure

`Double dashes indicate files inside folders.`

#### Optional files and folder (included in sample project)

```
components
--components.js
css
--main.min.css
-sample.html
```

#### Mandatory files and folders
```
js
--Wirup.min.js
views
--views.json
index.html
```

`Rename sample.html from this repo and use as `**index.html**`.`


### 2. Bring in your data
Wirup now uses the concept of a centralized data store to aggregate all data source. Adding your data can simply done in the format showed below.

###### Below is an example of how JSON data should be structured.

```js
wu.registerData('popularNames',[
                { index: 1, initial: 'A', lastname : 'Vespucci', fullname : 'Amerigo Vespucci' },
                { index :2, initial: 'B', lastname : 'Franklyn', fullname : 'Benjamin Franklyn' }
]);
```

Alternatively you could use arrays to feed your UI.

###### Below is an example of how your arrays could look like.

```js
 wu.registerData('rockets',
  [
   '(The Legendary) Saturn V', 
   'Delta IV Heavy',
   'Falcon Heavy',
   'Delta IV', 
   'Ariane 4', 
   'Atlas V'
  ]
);

```

##### Also, you could use a simple object like the one shown below:

```js
wu.registerData('price',[{
   adultFare : 1110.00,
   childFare : 861.00 
}]);
```

### 3. Create Component(s)

Goto `components/components.js` file. Register your component(s) like the given examples.

This is like giving a wireframe to your component. You can use simple HTML and JS to do so. 

Wirup has evolved to incorporate **template literals** as they have become a natural part of JS and the web. 

Make sure **HTML for the component is enclosed in ticks and not single quotes**.

##### JSON Array as data source 

Below is an example of registering a component that will eventually use a JSON array as a data source.

```js
wu.registerComponent('listbox', (item) => {
        return `
        <li>
         <p>
         <span class="result_no">${item.index}</span>  <span class="result_title"><span class="result_cap">   
                ${item.initial}</span>${item.lastname}</span>
         </p>
         <p class="result_desc">${item.fullname}</p>
        </li>
        `          
});
```

`Notice that you do not require explcitly mentioning the data source while registering a component. It is only during usage in your views you setup your data source.` 

**`This de-coupling makes it easier to switch data sources for a component at runtime.`**

The 'item' argument can be renamed to suit your naming scheme. However, make sure the argument name is used inside the anonymous function.

##### Regular JS Array as data source 

Alternatively, you can setup a component to use **array as a data source**. Below is an example of a component using an array.

```js
wu.registerComponent('rocketbox', (item) => {return `
        <li>
        <p class="network_title">${item}</p>
        </li>`            
});
```


Another way of wiring up would be to use an object. If you have a number of independent variables, this approach is handy. 

`The only caveat is that if you have html elements or components using data source(s), make sure the data source is registered before rendering the components.`

### 4. Setup views(s)

Quickly create a text file that corresponds to the name of the page you want to create. This will contain regular HTML like any other page. Remember **`views are containers for components`**.

Once you have created the textfile for your view (in the **views** folder), update the views.json. **Add your page to the views array** in the file and define the route on which you wish to see it. 


```json
{
    "views": [
        {
            "viewName": "listView",
            "url": "/",
            "viewFile": "listView.html"
        }
    ]
}
```

If you do not wish to set up any HTML and use only existing components you can do as shown below

```html
<listbox datasource="popularNames"></listbox>
```



### 5. Wait! Are we done already? 

Do not forget to get everything `wired up` with one simple command in any Javascript block on your page.

```js
wu.init();
```

## Or
You could invoke a custom function once Wirup completes intialization. Use the below code to do the same.

```js
wu.init('yourOwnCustomFunction');
```

`Note that the custom function name is passed as a string here.`

If you choose to invoke your custom function, make sure to define it.


```js
function yourOwnCustomFunction(){
    //Build what you like here!!
}
```

#### Now, we are ready! ####

If you have node installed, simply type from the project directory. 

```console
http-server
```

Alternatively you code host your project in any web server and couple with technologies like **ASP.Net Core, Bottle, Flask** and many more.

## Quick Fun Trick

With the given sample app in the **example** folder, launch the app and open the console on your favorite browser and type this:

```
wu.updateData('price',0,{"adultFare" : 2000, "childFare": 300});
```

## Features

- **One-Way-Data-Binding**

![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/WirupDataBind.png)

Wirup aims to keep your UI element(s) in sync with your data. This may be a move away from the initial approach to accommodate two-way binding. This is a conscious decision to minimize overhead in the framework and keeping it lightweight. 

- **Component Portability**

Developers can quickly define small snippets of code as components and use them across the application. Components become condensed into small re-usable tags which can dropped into any views. Also, their bound-data works right out of the box!!

- **Easy Routing**

![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/WirupRoutingSupport.png)

Routing is one of the more complex behavior(s) to control with UI frameworks. Wirup now supports a **non-hash-tag** based approach. Just define your routes with the views and keep moving on. Make sure to setup a base route like below in the views.json.

```json
{
    "views": [
        {
            "viewName": "sampleView",
            "url": "/",
            "HTML": "sampleView.html"
        }
    ]
}
```

- **Consistent behavior**

In its limited number of components, Wirup pushes developers to structure data driven components like lists correctly to ensure consistent behavior across browsers.

- **Data Sources**

Wirup is meant to work with the most commonly used data sources in a structured manner.

- **Data Passing between Views**

Data is fed to views from a central data source. This does away with the need to re-wire or pass data between views.

## Bonus Feature(s)

- **Support for Analytics**

Wirup is built around continuous improvement and improvisation. The framework provisions this by providing a data structure to track user interactions. This feature should be solely used to identify bottlenecks in the user experience and deliver a quality experience.

Use the below code sample to track user interactions in different points in the application.

```js
wu.registerAction('Action Name','Point of Action','Comment(s)');
```

Wirup strictly recommends against using these traces to pepper the experience with adware.

## Wirup Architecture

**Natural Data Objects**

>Wirup uses natural data objects like `JSON and Arrays` to serve as data sources for the application. The focus is to avoid managing complex models which need to be maintained separately. 

**Views**

>The application is subdivided into views (think as separate pages). These are like `UI containers which can be mapped on to specific URLs`.

**Components**

![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/WirupPortableComponents.png)

>Components are individual interface elements which can be wired up with data and used across views. Seamless component re-usability across views (or pages) is one of the key features of Wirup.

**Bound DOM Nodes**

>Once a component is defined and its data source setup, its iterative elements and automatically bound to the data source with `one-way-data-binding`.

>Any changes in the data source object, instantly updates the DOM component. This is done using `reactive` setters ensuring components are updated immediately when data changes.

## The **wu** Object

Wirup.js file exposes a global object **wu** which can be used by the application. They key reason this is done to do away with `initialization` process.

## Suggested Application Architecture

`Asynchronous and Service Oriented`

Wirup is intentionally developed in a way that caters to modern applications. In setups, where all the heavy lifting is done by REST based services and UI is only intended for rendering, Wirup is ideal.

## Happy Coding!!