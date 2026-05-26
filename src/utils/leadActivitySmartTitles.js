const smartActivityTitles = {
  call: ['Call connected', 'Requirement discussed', 'Pricing discussed', 'Client asked for details'],
  not_connected: ['Call not connected', 'No answer from client', 'Number busy', 'Phone switched off', 'Call declined'],
  demo_done: ['Demo completed', 'Product demo done', 'Demo feedback received', 'Client wants proposal'],
  lost: ['Lead lost', 'Not interested', 'Budget issue', 'Chose competitor', 'No response from client'],
  demo_scheduled: ['Demo scheduled', 'Demo date confirmed', 'Online demo booked', 'Product walkthrough scheduled'],
  follow_up: ['Follow-up scheduled', 'Call back requested', 'Next follow-up planned', 'Reminder set for client'],
  won: ['Lead won', 'Deal confirmed', 'Payment discussion completed', 'Client approved proposal'],
};

function getActivityModal() {
  return Array.from(document.querySelectorAll('.ld-modal')).find((modal) => {
    const title = modal.querySelector('.ld-modal-top h3')?.textContent || '';
    return title.includes('Activity');
  });
}

function getTitleField(modal) {
  return Array.from(modal.querySelectorAll('.ld-field')).find((field) => field.querySelector('span')?.textContent?.trim() === 'Title');
}

function clearTitleError(field) {
  field?.classList.remove('has-error');
  field?.querySelector('.ld-error-text')?.remove();
}

function showTitleError(field, message) {
  if (!field) return;
  field.classList.add('has-error');
  let error = field.querySelector('.ld-error-text');
  if (!error) {
    error = document.createElement('small');
    error.className = 'ld-error-text';
    field.appendChild(error);
  }
  error.textContent = message;
}

function setNativeInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function ensureTitleHelper() {
  const modal = getActivityModal();
  if (!modal) return;

  const typeSelect = modal.querySelector('select');
  const titleField = getTitleField(modal);
  const titleInput = titleField?.querySelector('input');
  if (!typeSelect || !titleField || !titleInput) return;

  let helper = modal.querySelector('.ld-title-helper');
  if (!helper) {
    helper = document.createElement('div');
    helper.className = 'ld-title-helper';
    titleField.insertAdjacentElement('afterend', helper);
  }

  const type = typeSelect.value || 'call';
  const suggestions = smartActivityTitles[type] || smartActivityTitles.call;
  helper.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = suggestion;
    button.addEventListener('click', () => {
      setNativeInputValue(titleInput, suggestion);
      titleInput.dataset.smartTitle = '1';
      clearTitleError(titleField);
    });
    helper.appendChild(button);
  });

  if (!titleInput.value.trim() || titleInput.dataset.smartTitle === '1') {
    setNativeInputValue(titleInput, suggestions[0]);
    titleInput.dataset.smartTitle = '1';
  }
}

function validateActivityForm(form) {
  const modal = getActivityModal();
  if (!modal || !modal.contains(form)) return true;
  const titleField = getTitleField(modal);
  const titleInput = titleField?.querySelector('input');
  const value = titleInput?.value?.trim() || '';
  clearTitleError(titleField);
  if (value.length < 3) {
    showTitleError(titleField, 'Title kam se kam 3 letters ka hona chahiye.');
    titleInput?.focus();
    return false;
  }
  return true;
}

const observer = new MutationObserver(() => ensureTitleHelper());
observer.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('change', (event) => {
  const modal = getActivityModal();
  if (modal && modal.contains(event.target) && event.target.tagName === 'SELECT') {
    const titleField = getTitleField(modal);
    const input = titleField?.querySelector('input');
    if (input) input.dataset.smartTitle = '1';
    setTimeout(ensureTitleHelper, 0);
  }
});

document.addEventListener('input', (event) => {
  const modal = getActivityModal();
  const titleField = modal && getTitleField(modal);
  const input = titleField?.querySelector('input');
  if (event.target === input) {
    input.dataset.smartTitle = '';
    clearTitleError(titleField);
  }
});

document.addEventListener('submit', (event) => {
  if (!validateActivityForm(event.target)) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

ensureTitleHelper();
