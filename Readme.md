# Team Draw
This Doc is not final

## Shape Services
If you want to add more shape options you have to create services with the following guidelines (Recommended only)
1. Create a new service using the slatePainting module name.
1. Use Capital first letter for service name e.g 'Square'
1. Provide default standard methods such as setUp, preview, draw, startDraw
 you can also create getters and setters for your shape properties as you wish.
1. The ``` setUp ``` method must hava the follwiing mandatory arguments even if you are not using them: 
``` javascript 
    setUp(canvas, previewCanvas, strokeWidth, color, fillColor) {
        //you custom implementation here
    }
    //Feel free to add your custom arguments after fillColor
    //See the provided services for examples under client/app/slate
```
1. Make sure to map the desire mouse events on the slate.commander.service slateCmd service.
If you dont do this, the slate directive will not know how to work with your shape.

## Slate Directive Usage
You should set the ``` slate ``` directive on the div you wish to interact with.                    
Example
``` html
 <div slate  width="680" height="480" data-layers="layers" data-set-up-tool="setUpTool"></div>
```
Notice the data-layers and data-set-up-tool properties. Both of them have to me mapped to an in ``` scope ``` variable that provides the properties for the service you require.

**Pencil Service setUp**
``` javascript
setUp: function (canvas, previewCanvas, strokeWidth, color) {  ... }
```
When referencing from the service
``` javascript
Pencil.setUp(canvas, previewCanvas, strokeWidth, color) {  ... }
```
It does not matter how you call it as long as you provide the correct parameters to the setup.

The slate directive has a watch on both data attributes and it will update accordingly.
