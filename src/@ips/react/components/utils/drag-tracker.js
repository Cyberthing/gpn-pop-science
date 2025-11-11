
export function track($el, cb, opts) {

    const state = {}

    state.mode = opts.mode || 'inertial'
    state.ready = true,
    // Tells the app if the user is dragging the pointer
    state.dragging = false,
    // Stores the pointer starting X position for the pointer tracking
    state.pointerStartPosX = 0,
    // Stores the pointer ending X position for the pointer tracking
    state.pointerEndPosX = 0,
    // Stores the distance between the starting and ending pointer X position in each time period we are tracking the pointer
    state.pointerDistance = 0,

    // The starting time of the pointer tracking period
    state.monitorStartTime = 0,
    // The pointer tracking time duration
    state.monitorInt = 10,
    // A setInterval instance used to call the rendering function
    state.ticker = 0,
    // Sets the speed of the image sliding animation
    state.speedMultiplier = opts.speedMultiplier||10,
    // CanvasLoader instance variable
    state.spinner,

    // Stores the total amount of images we have in the sequence
    state.totalFrames = (opts.range[1]-opts.range[0] + 1)||100,
    // The current frame value of the image slider animation
    state.currentFrame = 0,
    // Stores all the loaded image objects
    state.frames = [],
    // The value of the end frame which the currentFrame will be tweened to during the sliding animation
    state.endFrame = 0,
    // We keep track of the loaded images by increasing every time a new image is added to the image slider
    state.loadedImages = 0,

    // Initial spin demo vars
    state.demoMode = false,

    state.fakePointer = {
        x: 0,
        speed: 4
    },

    state.fakePointerTimer = 0

    const getNormalizedCurrentFrame = ()=>{
        var c = -Math.ceil(state.currentFrame % state.totalFrames);
        if (c < 0) c += (state.totalFrames);
        return c;
    };


    /**
    * Returns a simple event regarding the original event is a mouse event or a touch event.
    */
    const getPointerEvent = (event)=>{
        return (event.targetTouches) ? event.targetTouches[0] : event;
    };
    
    /**
    * Adds the jQuery "mousedown" event to the image slider wrapper.
    */
    $el.addEventListener("mousedown", (event)=>{
        //quitDemoMode();

        // Prevents the original event handler behaciour
        event.preventDefault();
        // Stores the pointer x position as the starting position
        state.pointerStartPosX = getPointerEvent(event).pageX;
        // Tells the pointer tracking function that the user is actually dragging the pointer and it needs to track the pointer changes
        state.dragging = true;
    });
    
    /**
    * Adds the jQuery "mouseup" event to the document. We use the document because we want to let the user to be able to drag
    * the mouse outside the image slider as well, providing a much bigger "playground".
    */
    document.addEventListener("mouseup", (event)=>{
        // Prevents the original event handler behaciour
        event.preventDefault();
        // Tells the pointer tracking function that the user finished dragging the pointer and it doesn't need to track the pointer changes anymore
        state.dragging = false;
    });
    
    /**
    * Adds the jQuery "mousemove" event handler to the document. By using the document again we give the user a better user experience
    * by providing more playing area for the mouse interaction.
    */
    document.addEventListener("mousemove", (event)=>{
        if(state.demoMode) {
            return;
        }

        // Prevents the original event handler behaciour
        event.preventDefault();
        // Starts tracking the pointer X position changes
        trackPointer(event);
    });
    
    /**
    *
    */
    $el.addEventListener("touchstart", (event)=>{
        //quitDemoMode();

        // Prevents the original event handler behaciour
        event.preventDefault();
        // Stores the pointer x position as the starting position
        state.pointerStartPosX = getPointerEvent(event).pageX;
        // Tells the pointer tracking function that the user is actually dragging the pointer and it needs to track the pointer changes
        state.dragging = true;
    });
    
    /**
    *
    */
    $el.addEventListener("touchmove", (event)=>{
        // Prevents the original event handler behaciour
        event.preventDefault();
        // Starts tracking the pointer X position changes
        trackPointer(event);
    });
    
    /**
    *
    */
    $el.addEventListener("touchend", (event)=>{
        // Prevents the original event handler behaciour
        event.preventDefault();
        // Tells the pointer tracking function that the user finished dragging the pointer and it doesn't need to track the pointer changes anymore
        state.dragging = false;
    });

    /**
    * Renders the image slider frame animations.
    */
    const render = ()=>{
        // The rendering function only runs if the "currentFrame" value hasn't reached the "endFrame" one
        if(state.currentFrame !== state.endFrame)
        {   
            /*
                Calculates the 10% of the distance between the "currentFrame" and the "endFrame".
                By adding only 10% we get a nice smooth and eased animation.
                If the distance is a positive number, we have to ceil the value, if its a negative number, we have to floor it to make sure
                that the "currentFrame" value surely reaches the "endFrame" value and the rendering doesn't end up in an infinite loop.
            */
            var frameEasing = state.endFrame < state.currentFrame ? Math.floor((state.endFrame - state.currentFrame) * 0.1) : Math.ceil((state.endFrame - state.currentFrame) * 0.1);
            // Sets the current image to be hidden
            //hidePreviousFrame();
            // Increments / decrements the "currentFrame" value by the 10% of the frame distance
            state.currentFrame += frameEasing;
            // Sets the current image to be visible
            cb({ position: getNormalizedCurrentFrame() })
            //showCurrentFrame();
        } else {
            // If the rendering can stop, we stop and clear the ticker
            clearInterval(state.ticker);
            state.ticker = 0;
        }
    };
        
    const renderImmediate = ()=>{
        // The rendering function only runs if the "currentFrame" value hasn't reached the "endFrame" one
        if(state.currentFrame !== state.endFrame)
        {   
            state.currentFrame = state.endFrame
            // Sets the current image to be visible
            cb({ position: getNormalizedCurrentFrame() })
        } else {
            // If the rendering can stop, we stop and clear the ticker
            clearInterval(state.ticker);
            state.ticker = 0;
        }
    };

    /**
    * Creates a new setInterval and stores it in the "ticker"
    * By default I set the FPS value to 60 which gives a nice and smooth rendering in newer browsers
    * and relatively fast machines, but obviously it could be too high for an older architecture.
    */
    const refresh = ()=>{
        // If the ticker is not running already...
        if (state.ticker === 0) {
            // Let's create a new one!
            state.ticker = setInterval(render, Math.round(1000 / 60));
        }
    };

    /**
    * Tracks the pointer X position changes and calculates the "endFrame" for the image slider frame animation.
    * This function only runs if the application is ready and the user really is dragging the pointer; this way we can avoid unnecessary calculations and CPU usage.
    */
    const trackPointer = state.mode == 'inertial' ? 
        (event)=>{
            var userDragging = state.ready && state.dragging ? true : false;
            var demoDragging = state.demoMode;

            //trace('trackPointer',dragging, ready)

            if(userDragging || demoDragging) {
                
                // Stores the last x position of the pointer
                state.pointerEndPosX = userDragging ? getPointerEvent(event).pageX : state.fakePointer.x;

                // Checks if there is enough time past between this and the last time period of tracking
                if(state.monitorStartTime < new Date().getTime() - state.monitorInt) {
                    // Calculates the distance between the pointer starting and ending position during the last tracking time period
                    state.pointerDistance = state.pointerEndPosX - state.pointerStartPosX;
                    // Calculates the endFrame using the distance between the pointer X starting and ending positions and the "speedMultiplier" values
                    //endFrame = 
                    state.endFrame = state.currentFrame + Math.ceil((state.totalFrames - 1) * state.speedMultiplier * (state.pointerDistance / $el.offsetWidth));
                    //trace('newFrame', newFrame, state.pointerDistance, (state.totalFrames - 1) * state.speedMultiplier * (state.pointerDistance / $el.offsetWidth))
                    // Updates the image slider frame animation
                    refresh();

                    // restarts counting the pointer tracking period
                    state.monitorStartTime = new Date().getTime();
                    // Stores the the pointer X position as the starting position (because we started a new tracking period)

                    state.pointerStartPosX = state.pointerEndPosX//userDragging ? getPointerEvent(event).pageX : state.fakePointer.x;

                }
            } else {
                return;
            }
        }
        :(state.mode == 'immediate' ? 
            (event)=>{
                var userDragging = state.ready && state.dragging ? true : false;
                var demoDragging = state.demoMode;

                //trace('trackPointer',dragging, ready)

                if(userDragging || demoDragging) {
                    
                    // Stores the last x position of the pointer
                    state.pointerEndPosX = userDragging ? getPointerEvent(event).pageX : state.fakePointer.x;

                    // Checks if there is enough time past between this and the last time period of tracking
                    if(state.monitorStartTime < new Date().getTime() - state.monitorInt) {
                        // Calculates the distance between the pointer starting and ending position during the last tracking time period
                        state.pointerDistance = state.pointerEndPosX - state.pointerStartPosX;
                        // Calculates the endFrame using the distance between the pointer X starting and ending positions and the "speedMultiplier" values
                        //endFrame = 
                        state.endFrame = state.currentFrame + Math.ceil((state.totalFrames - 1) * state.speedMultiplier * (state.pointerDistance / $el.offsetWidth));
                        //trace('newFrame', newFrame, state.pointerDistance, (state.totalFrames - 1) * state.speedMultiplier * (state.pointerDistance / $el.offsetWidth))
                        // Updates the image slider frame animation

                        state.currentFrame = state.endFrame
                        cb({ position: getNormalizedCurrentFrame() })
                        
                        state.pointerStartPosX = state.pointerEndPosX//userDragging ? getPointerEvent(event).pageX : state.fakePointer.x;

                    }
                } else {
                    return;
                }
            }: ()=>{

            })

    state.destroy = ()=>{}

    return state
}