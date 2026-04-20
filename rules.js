class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        //get the data object for the current story location
        let locationData = this.engine.storyData.Locations[key];
        let choices = locationData.Choices;

        // Initialize trackers
        if (!this.engine.visited) this.engine.visited = new Set();
        if (!this.engine.inventory) this.engine.inventory = new Set()
        if (!this.engine.counters) this.engine.counters = {};

        // Show different message based on first visit
        if (!this.engine.visited.has(key) && locationData.FirstVisitBody) {
            // Helps Json interpret newline
            this.engine.show(locationData.FirstVisitBody.replace(/\n/g, "<br>"));
        } else {
            this.engine.show(locationData.Body.replace(/\n/g, "<br>"));
        }

        // Mark as visited
        this.engine.visited.add(key);

        if (choices && choices.length > 0) {
            for (let choice of choices) {
                // Skip pick-up choices if item already collected
                if (choice.Item && this.engine.inventory.has(choice.Item)) continue;

                // Skip locked choices if required item not in inventory
                if (choice.Requires && !this.engine.inventory.has(choice.Requires)) continue;

                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            if (choice.Item) {
                this.engine.inventory.add(choice.Item);
                this.engine.show("You picked up: " + choice.Text);
            }
            if (choice.Count) {
                let item = choice.Count;
                this.engine.counters[item] = (this.engine.counters[item] || 0) + 1;
                this.engine.show("You printed a statue! You now have " + this.engine.counters[item] + " Banana Slug Statue(s).");
            }
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');