import React, {
	Component,
	Fragment
} from "react";
import PropTypes from "prop-types";


export default class SuggestionBox extends Component {
	static propTypes = {
		suggestions: PropTypes.instanceOf(Array)
	};

	static defaultProps = {
		suggestions: []
	};

	constructor(props) {
		super(props);

		this.state = {
			// The active selection's index
			activeSuggestion: 0,
			// The suggestions that match the user's input
			filteredSuggestions: [],
			// Whether or not the suggestion list is shown
			showSuggestions: false,
			// What the user has entered
			userInput: "",

		};
	}

	onChange = e => {
		const {
			suggestions
		} = this.props;
		const userInput = e.currentTarget.value;

		// Filter our suggestions that don't contain the user's input
		const filteredSuggestions = suggestions.filter(
			suggestion =>
			suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
		);

		this.setState({
			activeSuggestion: 0,
			filteredSuggestions,
			showSuggestions: true,
			userInput: e.currentTarget.value
		}, () => {

			this.props.suggestionPipeline(this.state.userInput)


		});
	};

	onClick = e => {
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: e.currentTarget.innerText
		});
	};

	onKeyDown = e => {
		const {
			activeSuggestion,
			filteredSuggestions
		} = this.state;

		// User pressed the enter key
		if (e.keyCode === 13) {
			this.setState({
				activeSuggestion: 0,
				showSuggestions: false,
				userInput: filteredSuggestions[activeSuggestion]
			});
		}
		// User pressed the up arrow
		else if (e.keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}

			this.setState({
				activeSuggestion: activeSuggestion - 1
			});
		}
		// User pressed the down arrow
		else if (e.keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}

			this.setState({
				activeSuggestion: activeSuggestion + 1
			});
		}
	};



	render() {
		const {
			onChange,
			onClick,
			onKeyDown,
			state: {
				activeSuggestion,
				filteredSuggestions,
				showSuggestions,
				userInput
			}
		} = this;

		let suggestionsListComponent;

		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				suggestionsListComponent = (
					<ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;


              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
				);
			} else {
				suggestionsListComponent = (
					<div class="no-suggestions">
            <span className="text-tiny error">We don't have any categories that match that.</span>
          </div>
				);
			}
		}


		return (
			<Fragment>
        <input
          type="text"
          name="sugg"
          onChange={this.onChange}
          placeholder="eg. Bakery"
          className="sugg form-control"
          onKeyDown={onKeyDown}
          value={userInput}
          autocomplete="off"
          id="suggestionBox"
        />
        {suggestionsListComponent}
      </Fragment>
		);
	}
}
