function lookupPathSliderKnob()
{
    return "../layout/slider/images/knob.png";
}
function Slider( givenMin, givenMax, givenInitialValue, givenNotifierFunction )
{
    var val = givenInitialValue;
    var active = false; 
    var container = null;
    var knob = null;
    
    this.bindElements = function ( givenSliderContainer, givenKnob )
        {
            container = givenSliderContainer;
            knob = givenKnob;
        };
    this.setValue = function ( givenValue )
        {
            val = givenValue;
            this.resync();
        };
    this.getValue = function ( givenValue )
        {
            return val;
        };
    this.activate = function() 
        { 
            active = true; 
            addAnEvent( document, "mousemove", container.onchange );
            addAnEvent( document, "mouseup", this.deactivate );
        };
    this.deactivate = function( givenEvent ) 
        { 
            active = false; 
            stopEvent( givenEvent );
        };
    this.resync = function () 
        {   
            var adjustedWidth = container.scrollWidth - knob.scrollWidth; 
            knob.style.left = adjustedWidth * rescaleToRange( givenMin, givenMax, val )  + "px";
            givenNotifierFunction( val );                   
        };
    this.update = function ( givenEvent )
        {                   
            if( ! ( active && givenEvent && givenEvent.clientX ) ) return;
            var adjustedOffset = container.offsetLeft + knob.scrollWidth / 2;
            var adjustedWidth = container.scrollWidth - knob.scrollWidth;
            var rangeRelativeX = ( givenEvent.clientX - adjustedOffset ) / adjustedWidth;
            val = checkedInRange( givenMin, givenMax, givenMin + ( givenMax - givenMin ) * rangeRelativeX );
            stopEvent( givenEvent );
        };
}
function appendSlider( givenParent, givenSliderObject )
{    
    var mySliderDiv     = makeChildElement( givenParent, "div", "slider-container" );
    var myLeftDiv       = makeChildElement( mySliderDiv, "div", "slider-left" );
    var myRightDiv      = makeChildElement( mySliderDiv, "div", "slider-right" );
    var myKnob          = makeChildElement( mySliderDiv, "img", "slider-knob" );   
    
    myKnob.src          = lookupPathSliderKnob();
    
    with( givenSliderObject )
    {
        bindElements( mySliderDiv, myKnob );
        resync();

        mySliderDiv.onchange = function ( givenEvent )
            { 
                resync(); 
                update( givenEvent ); 
            };       
        addAnEvent( mySliderDiv, "mousedown", function( givenEvent ) 
            { 
                activate();   
                resync(); 
                update( givenEvent ); 
            } );      
        addAnEvent( mySliderDiv, "mouseup",  deactivate );
        //addAnEvent( mySliderDiv, "mouseout", deactivate );     
    } 
}