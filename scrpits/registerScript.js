document.addEventListener('DOMContentLoaded', () => {
   const form = document.querySelector('.register-form');
   const fields = form.querySelectorAll('input');
   const cpfInput = document.getElementById('cpf');
   const cepInput = document.getElementById('cep');
   const enderecoInput = document.getElementById('endereco');
   const cidadeInput = document.getElementById('cidade');
   const numeroInput = document.getElementById('numero');
   const passwordInput = document.getElementById('password');
   const confirmPasswordInput = document.getElementById('confirm-password');

   const lengthRequirement = document.getElementById('length-requirement');
   const uppercaseRequirement = document.getElementById('uppercase-requirement');
   const numberRequirement = document.getElementById('number-requirement');
   const confirmPasswordMessage = document.getElementById('confirm-password-message');

   // Verifica se todos os elementos essenciais foram carregados
   if (!form || !cpfInput || !cepInput || !enderecoInput || !cidadeInput || !passwordInput || !confirmPasswordInput ||
       !lengthRequirement || !uppercaseRequirement || !numberRequirement || !confirmPasswordMessage) {
       console.error('Um ou mais elementos essenciais não foram encontrados.');
       return;
   }

   form.addEventListener('submit', (e) => {
       e.preventDefault();
       let isValid = true;

       fields.forEach(field => {
           if (!validateField(field)) {
               isValid = false;
           }
       });

       if (isValid) {
           form.submit();
       }
   });

   fields.forEach(field => {
       field.addEventListener('blur', () => validateField(field));
   });

   cpfInput.addEventListener('input', () => formatCPF(cpfInput));
   cepInput.addEventListener('input', () => searchAddressByCEP(cepInput.value));
   numeroInput.addEventListener('input', enforceNumericInput); // Adiciona o filtro numérico

   // Adiciona a validação de senha em tempo real
   passwordInput.addEventListener('input', validatePassword);
   confirmPasswordInput.addEventListener('input', validateConfirmPassword);

   // Restringe o campo "Número" a apenas números
   function enforceNumericInput(event) {
       event.target.value = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
   }

   function validateField(field) {
       const value = field.value.trim();
       let isValid = true;

       if (field.id === 'first-name' || field.id === 'last-name') {
           isValid = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/.test(value);
       } else if (field.id === 'cpf') {
           isValid = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value); // CPF format (XXX.XXX.XXX-XX)
       } else if (field.id === 'email') {
           isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
       } else if (field.id === 'password') {
           isValid = validatePassword();
       } else if (field.id === 'confirm-password') {
           isValid = validateConfirmPassword();
       } else if (field.id === 'numero' || field.id === 'complemento') {
           // Apenas verifica se preenchido (campo opcional para 'complemento')
           isValid = value !== '';
           if (!isValid) {
               field.classList.remove('success');
               field.classList.remove('error');
               return true; // Retorna true para não marcar erro em campos vazios
           }
       }

       if (isValid) {
           field.classList.remove('error');
           field.classList.add('success');
       } else {
           field.classList.remove('success');
           field.classList.add('error');
       }

       return isValid;
   }

   function formatCPF(input) {
       let value = input.value.replace(/\D/g, '');
       if (value.length > 3) {
           value = value.replace(/^(\d{3})(\d)/, '$1.$2');
       }
       if (value.length > 7) {
           value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
       }
       if (value.length > 11) {
           value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
       }
       input.value = value.slice(0, 14);
   }

   function searchAddressByCEP(cep) {
       cep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
       if (cep.length === 8) { // Apenas faz a busca se o CEP tiver 8 dígitos
           fetch(`https://viacep.com.br/ws/${cep}/json/`)
               .then(response => {
                   if (!response.ok) throw new Error('Erro ao consultar o CEP');
                   return response.json();
               })
               .then(data => {
                   if (data.erro) {
                       alert('CEP não encontrado.');
                       return;
                   }
                   // Preenche os campos de endereço e cidade
                   enderecoInput.value = data.logradouro;
                   cidadeInput.value = data.localidade;
                   enderecoInput.classList.add('success');
                   cidadeInput.classList.add('success');
               })
               .catch(error => {
                   console.error('Erro:', error);
                   alert('Não foi possível buscar o endereço.');
               });
       }
   }

   function validatePassword() {
       const value = passwordInput.value;
       let isValid = true;

       // Valida o comprimento da senha
       if (value.length >= 6) {
           lengthRequirement.classList.add('valid');
           lengthRequirement.style.display = 'none'; // Esconde se atendido
       } else if (value.length > 0) {
           lengthRequirement.classList.remove('valid');
           lengthRequirement.style.display = 'block'; // Exibe se não atendido
           isValid = false;
       }

       // Valida se há uma letra maiúscula
       if (/[A-Z]/.test(value)) {
           uppercaseRequirement.classList.add('valid');
           uppercaseRequirement.style.display = 'none';
       } else if (value.length > 0) {
           uppercaseRequirement.classList.remove('valid');
           uppercaseRequirement.style.display = 'block';
           isValid = false;
       }

       // Valida se há um número
       if (/\d/.test(value)) {
           numberRequirement.classList.add('valid');
           numberRequirement.style.display = 'none';
       } else if (value.length > 0) {
           numberRequirement.classList.remove('valid');
           numberRequirement.style.display = 'block';
           isValid = false;
       }

       return isValid;
   }

   function validateConfirmPassword() {
       const password = passwordInput.value;
       const confirmPassword = confirmPasswordInput.value;

       if (confirmPassword === password && confirmPassword !== '') {
           confirmPasswordMessage.classList.add('valid');
           confirmPasswordMessage.style.display = 'block'; // Mostra a mensagem como atendida
           confirmPasswordInput.classList.remove('error');
           confirmPasswordInput.classList.add('success');
           return true;
       } else {
           confirmPasswordMessage.classList.remove('valid');
           confirmPasswordMessage.style.display = 'block'; // Mostra a mensagem de erro
           confirmPasswordInput.classList.remove('success');
           confirmPasswordInput.classList.add('error');
           return false;
       }
   }
});
