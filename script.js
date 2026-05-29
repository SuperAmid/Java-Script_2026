/**
 * SkillForge Calculator
 * Тема: Составление занятий (Услуги → Задания, Заявки → Занятия)
 * Индивидуальная операция: Расчёт стоимости услуг (цена × количество)
 */

class Calculator {
    constructor() {
        // Элементы DOM
        this.resultDisplay = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        this.infoPanel = document.getElementById('operationIndicator');
        
        // Состояние калькулятора
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperation = null;
        this.shouldResetScreen = false;
        this.lastResult = null;
        
        // Привязка контекста
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay('0');
        this.updateInfo('Готов к работе', 'fa-arrow-right');
    }
    
    setupEventListeners() {
        // Цифры
        document.querySelectorAll('.digit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDigit(btn.textContent));
        });
        
        // Операции
        document.getElementById('btn_op_plus').addEventListener('click', () => this.handleOperation('+'));
        document.getElementById('btn_op_minus').addEventListener('click', () => this.handleOperation('-'));
        document.getElementById('btn_op_mult').addEventListener('click', () => this.handleOperation('×'));
        document.getElementById('btn_op_div').addEventListener('click', () => this.handleOperation('÷'));
        
        // Индивидуальная операция
        document.getElementById('btn_op_cost').addEventListener('click', () => {
            this.handleOperation('cost');
            this.updateInfo('Введите количество', 'fa-ruble-sign');
        });
        
        // Специальные кнопки
        document.getElementById('btn_op_clear').addEventListener('click', () => this.clear());
        document.getElementById('btn_op_sign').addEventListener('click', () => this.toggleSign());
        document.getElementById('btn_op_percent').addEventListener('click', () => this.percent());
        document.getElementById('btn_op_equal').addEventListener('click', () => this.calculate());
        document.getElementById('btn_digit_dot').addEventListener('click', () => this.handleDecimal());
        
        // Клавиатура
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    // Обработка цифр
    handleDigit(digit) {
        if (this.shouldResetScreen) {
            this.resultDisplay.textContent = '';
            this.shouldResetScreen = false;
        }
        
        if (this.resultDisplay.textContent === '0' || this.resultDisplay.textContent === 'Ошибка') {
            this.resultDisplay.textContent = digit;
        } else {
            this.resultDisplay.textContent += digit;
        }
        
        this.updateCurrentOperand();
    }
    
    // Обновление текущего операнда
    updateCurrentOperand() {
        const currentValue = this.resultDisplay.textContent;
        
        if (this.currentOperation === null) {
            this.firstOperand = currentValue;
        } else {
            this.secondOperand = currentValue;
        }
    }
    
    // Обработка операции
    handleOperation(op) {
        if (this.currentOperation !== null && this.secondOperand !== '') {
            this.calculate();
        }
        
        this.currentOperation = op;
        this.firstOperand = this.resultDisplay.textContent;
        this.shouldResetScreen = true;
        
        // Обновление выражения
        this.updateExpression();
        
        // Обновление информации в зависимости от операции
        if (op === 'cost') {
            this.updateInfo('Расчёт стоимости', 'fa-ruble-sign');
        } else {
            this.updateInfo(`Операция: ${op}`, 'fa-calculator');
        }
    }
    
    // Вычисление результата
    calculate() {
        if (this.currentOperation === null || this.shouldResetScreen) return;
        
        if (this.secondOperand === '') {
            this.secondOperand = this.resultDisplay.textContent;
        }
        
        const a = parseFloat(this.firstOperand);
        const b = parseFloat(this.secondOperand);
        
        if (isNaN(a) || isNaN(b)) return;
        
        let result;
        
        switch (this.currentOperation) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '×':
                result = a * b;
                break;
            case '÷':
                result = b === 0 ? 'Ошибка' : a / b;
                break;
            case 'cost':
                result = a * b; // Индивидуальная операция: стоимость услуги
                break;
            default:
                return;
        }
        
        // Форматирование результата
        if (typeof result === 'number') {
            result = Math.round(result * 100) / 100;
            this.lastResult = result;
        }
        
        // Обновление дисплеев
        this.resultDisplay.textContent = result;
        this.updateExpression(true);
        
        // Сброс состояния
        this.firstOperand = result.toString();
        this.secondOperand = '';
        this.currentOperation = null;
        this.shouldResetScreen = true;
        
        // Обновление информации
        if (this.currentOperation === 'cost') {
            this.updateInfo(`Стоимость: ${result} ₽`, 'fa-check-circle');
            setTimeout(() => this.updateInfo('Готов к работе', 'fa-arrow-right'), 2000);
        }
    }
    
    // Обработка десятичной точки
    handleDecimal() {
        if (this.shouldResetScreen) {
            this.resultDisplay.textContent = '0';
            this.shouldResetScreen = false;
        }
        
        if (!this.resultDisplay.textContent.includes('.')) {
            this.resultDisplay.textContent += '.';
        }
        
        this.updateCurrentOperand();
    }
    
    // Очистка
    clear() {
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperation = null;
        this.shouldResetScreen = false;
        this.resultDisplay.textContent = '0';
        this.expressionDisplay.textContent = '';
        this.updateInfo('Очищено', 'fa-check');
        setTimeout(() => this.updateInfo('Готов к работе', 'fa-arrow-right'), 1000);
    }
    
    // Смена знака
    toggleSign() {
        const currentValue = parseFloat(this.resultDisplay.textContent);
        if (!isNaN(currentValue)) {
            this.resultDisplay.textContent = (currentValue * -1).toString();
            this.updateCurrentOperand();
        }
    }
    
    // Процент
    percent() {
        const currentValue = parseFloat(this.resultDisplay.textContent);
        if (!isNaN(currentValue)) {
            this.resultDisplay.textContent = (currentValue / 100).toString();
            this.updateCurrentOperand();
        }
    }
    
    // Обновление выражения
    updateExpression(isResult = false) {
        if (isResult) {
            this.expressionDisplay.textContent = `${this.firstOperand} ${this.currentOperation || ''} ${this.secondOperand} =`;
        } else if (this.currentOperation) {
            this.expressionDisplay.textContent = `${this.firstOperand} ${this.currentOperation}`;
        } else {
            this.expressionDisplay.textContent = '';
        }
    }
    
    // Обновление информационной панели
    updateInfo(text, icon) {
        if (this.infoPanel) {
            this.infoPanel.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
        }
    }
    
    // Обработка клавиатуры
    handleKeyboard(e) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9') {
            this.handleDigit(e.key);
        } else if (e.key === '.') {
            this.handleDecimal();
        } else if (e.key === '+' || e.key === '-') {
            this.handleOperation(e.key);
        } else if (e.key === '*') {
            this.handleOperation('×');
        } else if (e.key === '/') {
            e.preventDefault();
            this.handleOperation('÷');
        } else if (e.key === '=' || e.key === 'Enter') {
            this.calculate();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (e.key === '%') {
            this.percent();
        }
    }
}

// Инициализация калькулятора после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});