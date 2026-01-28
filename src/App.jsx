import { useState, useEffect } from 'react'
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip, 
  Legend 
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { 
  Home, 
  ArrowUpDown, 
  TrendingUp, 
  Target, 
  FileText,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  X,
  Wallet,
  PiggyBank,
  DollarSign,
  Calendar
} from 'lucide-react'
import './index.css'

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend
)

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

// Initial sample data
const initialTransactions = [
  { id: 1, type: 'income', description: 'Salário', category: 'Salário', amount: 8500, date: '2026-01-05' },
  { id: 2, type: 'income', description: 'Freelance', category: 'Freelance', amount: 2500, date: '2026-01-10' },
  { id: 3, type: 'expense', description: 'Aluguel', category: 'Moradia', amount: 2500, date: '2026-01-05' },
  { id: 4, type: 'expense', description: 'Supermercado', category: 'Alimentação', amount: 890, date: '2026-01-08' },
  { id: 5, type: 'expense', description: 'Combustível', category: 'Transporte', amount: 350, date: '2026-01-10' },
  { id: 6, type: 'expense', description: 'Netflix', category: 'Lazer', amount: 55.90, date: '2026-01-12' },
  { id: 7, type: 'expense', description: 'Farmácia', category: 'Saúde', amount: 180, date: '2026-01-15' },
]

const initialInvestments = [
  { id: 1, name: 'CDB 120% CDI', type: 'Renda Fixa', amount: 10000, currentValue: 10450, return: 4.5 },
  { id: 2, name: 'PETR4', type: 'Ações', amount: 3250, currentValue: 3875, return: 19.2 },
  { id: 3, name: 'HGLG11', type: 'FIIs', amount: 8250, currentValue: 8615, return: 4.4 },
  { id: 4, name: 'Tesouro IPCA+ 2029', type: 'Tesouro', amount: 3500, currentValue: 3680, return: 5.1 },
  { id: 5, name: 'Bitcoin', type: 'Cripto', amount: 9000, currentValue: 10500, return: 16.7 },
]

const initialGoals = [
  { id: 1, name: 'Reserva de Emergência', target: 30000, current: 15000, deadline: '2026-06-30' },
  { id: 2, name: 'Viagem Europa', target: 25000, current: 8500, deadline: '2026-12-31' },
  { id: 3, name: 'Entrada Apartamento', target: 100000, current: 25000, deadline: '2028-12-31' },
]

const expenseCategories = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Vestuário', 'Outros']
const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Bônus', 'Outros']

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : initialTransactions
  })
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('investments')
    return saved ? JSON.parse(saved) : initialInvestments
  })
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals')
    return saved ? JSON.parse(saved) : initialGoals
  })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('transaction')

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments))
  }, [investments])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense
  
  const totalInvestments = investments.reduce((sum, i) => sum + i.currentValue, 0)
  
  const totalGoalsProgress = goals.reduce((sum, g) => sum + g.current, 0)

  // Add new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      amount: parseFloat(transaction.amount)
    }
    setTransactions([newTransaction, ...transactions])
    setShowModal(false)
  }

  // Add new goal
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      target: parseFloat(goal.target),
      current: parseFloat(goal.current || 0)
    }
    setGoals([...goals, newGoal])
    setShowModal(false)
  }

  // Add new investment
  const addInvestment = (investment) => {
    const newInvestment = {
      id: Date.now(),
      ...investment,
      amount: parseFloat(investment.amount),
      currentValue: parseFloat(investment.currentValue),
      return: ((parseFloat(investment.currentValue) - parseFloat(investment.amount)) / parseFloat(investment.amount) * 100).toFixed(1)
    }
    setInvestments([...investments, newInvestment])
    setShowModal(false)
  }

  // Get expense data by category
  const expenseByCategory = expenseCategories.map(cat => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  }).filter(v => v > 0)

  const expenseLabels = expenseCategories.filter((cat, i) => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
    return total > 0
  })

  const pieChartData = {
    labels: expenseLabels,
    datasets: [{
      data: expenseByCategory,
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
      borderWidth: 0,
    }]
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a0a0b0',
          padding: 15,
          usePointStyle: true,
        }
      }
    }
  }

  // Bar chart data
  const barChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [11000, 10500, 12000, 11500, 13000, totalIncome],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Despesas',
        data: [7500, 8000, 7800, 8200, 7600, totalExpense],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
      }
    ]
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a0a0b0',
          usePointStyle: true,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#606080' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#606080' }
      }
    }
  }

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>💰 Controle Financeiro</h1>
        <p className="header-subtitle">Gerencie suas finanças com facilidade</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard 
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalInvestments={totalInvestments}
            transactions={transactions}
            goals={goals}
            pieChartData={pieChartData}
            pieChartOptions={pieChartOptions}
          />
        )}
        
        {currentPage === 'transactions' && (
          <Transactions 
            transactions={transactions}
            onAdd={() => openModal('transaction')}
          />
        )}
        
        {currentPage === 'investments' && (
          <Investments 
            investments={investments}
            totalValue={totalInvestments}
            onAdd={() => openModal('investment')}
          />
        )}
        
        {currentPage === 'goals' && (
          <Goals 
            goals={goals}
            onAdd={() => openModal('goal')}
          />
        )}
        
        {currentPage === 'reports' && (
          <Reports 
            transactions={transactions}
            barChartData={barChartData}
            barChartOptions={barChartOptions}
            pieChartData={pieChartData}
            pieChartOptions={pieChartOptions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />
        )}
      </main>

      {/* FAB Button */}
      {currentPage !== 'reports' && (
        <button className="fab" onClick={() => openModal(
          currentPage === 'investments' ? 'investment' : 
          currentPage === 'goals' ? 'goal' : 'transaction'
        )}>
          <Plus size={24} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          <Home size={22} />
          <span>Início</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
          onClick={() => setCurrentPage('transactions')}
        >
          <ArrowUpDown size={22} />
          <span>Transações</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'investments' ? 'active' : ''}`}
          onClick={() => setCurrentPage('investments')}
        >
          <TrendingUp size={22} />
          <span>Investir</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'goals' ? 'active' : ''}`}
          onClick={() => setCurrentPage('goals')}
        >
          <Target size={22} />
          <span>Metas</span>
        </button>
        <button 
          className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
          onClick={() => setCurrentPage('reports')}
        >
          <FileText size={22} />
          <span>Relatórios</span>
        </button>
      </nav>

      {/* Modal */}
      {showModal && (
        <Modal 
          type={modalType}
          onClose={() => setShowModal(false)}
          onAddTransaction={addTransaction}
          onAddGoal={addGoal}
          onAddInvestment={addInvestment}
        />
      )}
    </div>
  )
}

// Dashboard Component
function Dashboard({ balance, totalIncome, totalExpense, totalInvestments, transactions, goals, pieChartData, pieChartOptions }) {
  const recentTransactions = transactions.slice(0, 5)
  
  return (
    <>
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card summary-card--full card">
          <div className="summary-card__content">
            <div className="summary-card__label">Saldo Total</div>
            <div className="summary-card__value" style={{ 
              fontSize: '2rem',
              color: balance >= 0 ? 'var(--success)' : 'var(--danger)'
            }}>
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
        
        <div className="summary-card summary-card--income card">
          <div className="summary-card__content">
            <div className="summary-card__label">Receitas</div>
            <div className="summary-card__value">{formatCurrency(totalIncome)}</div>
          </div>
        </div>
        
        <div className="summary-card summary-card--expense card">
          <div className="summary-card__content">
            <div className="summary-card__label">Despesas</div>
            <div className="summary-card__value">{formatCurrency(totalExpense)}</div>
          </div>
        </div>
        
        <div className="summary-card summary-card--investment card">
          <div className="summary-card__content">
            <div className="summary-card__label">Investimentos</div>
            <div className="summary-card__value">{formatCurrency(totalInvestments)}</div>
          </div>
        </div>
        
        <div className="summary-card summary-card--goal card">
          <div className="summary-card__content">
            <div className="summary-card__label">Economia</div>
            <div className="summary-card__value">
              {totalIncome > 0 ? ((1 - totalExpense / totalIncome) * 100).toFixed(0) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Despesas por Categoria</h3>
        <div style={{ height: '250px' }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* Goals Progress */}
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Progresso das Metas</h3>
        </div>
        {goals.slice(0, 2).map(goal => (
          <div key={goal.id} className="goal-card">
            <div className="goal-header">
              <div>
                <div className="goal-title">{goal.name}</div>
                <div className="goal-deadline">
                  <Calendar size={12} /> {formatDate(goal.deadline)}
                </div>
              </div>
              <span className="badge badge--info">
                {((goal.current / goal.target) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar__fill progress-bar__fill--info"
                style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
              />
            </div>
            <div className="goal-values mt-sm">
              <span className="goal-current">{formatCurrency(goal.current)}</span>
              <span className="goal-target">de {formatCurrency(goal.target)}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Transactions */}
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Últimas Transações</h3>
        </div>
        <div className="transaction-list">
          {recentTransactions.map(t => (
            <div key={t.id} className="transaction-item">
              <div className={`transaction-icon transaction-icon--${t.type}`}>
                {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
              </div>
              <div className="transaction-info">
                <div className="transaction-title">{t.description}</div>
                <div className="transaction-category">{t.category}</div>
              </div>
              <div>
                <div className={`transaction-amount transaction-amount--${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
                <div className="transaction-date">{formatDate(t.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// Transactions Component
function Transactions({ transactions, onAdd }) {
  const [filter, setFilter] = useState('all')
  
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  return (
    <>
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Transações</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`tab ${filter === 'income' ? 'active' : ''}`}
          onClick={() => setFilter('income')}
        >
          Receitas
        </button>
        <button 
          className={`tab ${filter === 'expense' ? 'active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          Despesas
        </button>
      </div>

      <div className="transaction-list">
        {filteredTransactions.map(t => (
          <div key={t.id} className="transaction-item">
            <div className={`transaction-icon transaction-icon--${t.type}`}>
              {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
            </div>
            <div className="transaction-info">
              <div className="transaction-title">{t.description}</div>
              <div className="transaction-category">{t.category}</div>
            </div>
            <div>
              <div className={`transaction-amount transaction-amount--${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
              <div className="transaction-date">{formatDate(t.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// Investments Component
function Investments({ investments, totalValue, onAdd }) {
  const totalReturn = investments.reduce((sum, i) => sum + (i.currentValue - i.amount), 0)
  
  return (
    <>
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Investimentos</h2>
      
      <div className="summary-cards" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="summary-card summary-card--investment card">
          <div className="summary-card__content">
            <div className="summary-card__label">Total Investido</div>
            <div className="summary-card__value">{formatCurrency(totalValue)}</div>
          </div>
        </div>
        <div className="summary-card summary-card--income card">
          <div className="summary-card__content">
            <div className="summary-card__label">Rentabilidade</div>
            <div className="summary-card__value" style={{ color: totalReturn >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}
            </div>
          </div>
        </div>
      </div>

      {investments.map(inv => (
        <div key={inv.id} className="investment-card">
          <div className="investment-header">
            <div className="investment-name">{inv.name}</div>
            <span className="investment-type">{inv.type}</span>
          </div>
          <div className="investment-values">
            <div className="investment-amount">{formatCurrency(inv.currentValue)}</div>
            <div className={`investment-return investment-return--${inv.return >= 0 ? 'positive' : 'negative'}`}>
              {inv.return >= 0 ? '+' : ''}{inv.return}%
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

// Goals Component
function Goals({ goals, onAdd }) {
  return (
    <>
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Metas Financeiras</h2>
      
      {goals.map(goal => {
        const progress = (goal.current / goal.target) * 100
        return (
          <div key={goal.id} className="goal-card">
            <div className="goal-header">
              <div>
                <div className="goal-title">{goal.name}</div>
                <div className="goal-deadline">
                  <Calendar size={12} style={{ marginRight: '4px' }} />
                  Prazo: {formatDate(goal.deadline)}
                </div>
              </div>
              <span className={`badge ${progress >= 100 ? 'badge--success' : progress >= 70 ? 'badge--warning' : 'badge--info'}`}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-bar__fill ${progress >= 100 ? 'progress-bar__fill--success' : progress >= 70 ? 'progress-bar__fill--warning' : 'progress-bar__fill--info'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="goal-values mt-sm">
              <span className="goal-current">{formatCurrency(goal.current)}</span>
              <span className="goal-target">de {formatCurrency(goal.target)}</span>
            </div>
            <div className="goal-percentage">
              Faltam {formatCurrency(goal.target - goal.current)}
            </div>
          </div>
        )
      })}
    </>
  )
}

// Reports Component  
function Reports({ transactions, barChartData, barChartOptions, pieChartData, pieChartOptions, totalIncome, totalExpense }) {
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0
  
  return (
    <>
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Relatórios</h2>
      
      {/* Income vs Expense Chart */}
      <div className="chart-container">
        <h3 className="chart-title">Receitas vs Despesas</h3>
        <div style={{ height: '250px' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Expense Distribution */}
      <div className="chart-container">
        <h3 className="chart-title">Distribuição de Despesas</h3>
        <div style={{ height: '250px' }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* Financial Indicators */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 className="chart-title">Indicadores Financeiros</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Taxa de Poupança</span>
          <span style={{ fontWeight: 600, color: savingsRate >= 20 ? 'var(--success)' : savingsRate >= 10 ? 'var(--warning)' : 'var(--danger)' }}>
            {savingsRate}%
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Receita Total</span>
          <span style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(totalIncome)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Despesa Total</span>
          <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md) 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Economia</span>
          <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{formatCurrency(totalIncome - totalExpense)}</span>
        </div>
      </div>
    </>
  )
}

// Modal Component
function Modal({ type, onClose, onAddTransaction, onAddGoal, onAddInvestment }) {
  const [transactionType, setTransactionType] = useState('expense')
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    target: '',
    current: '',
    deadline: '',
    currentValue: '',
    investmentType: 'Renda Fixa'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (type === 'transaction') {
      onAddTransaction({
        type: transactionType,
        description: formData.description,
        category: formData.category,
        amount: formData.amount,
        date: formData.date
      })
    } else if (type === 'goal') {
      onAddGoal({
        name: formData.name,
        target: formData.target,
        current: formData.current || 0,
        deadline: formData.deadline
      })
    } else if (type === 'investment') {
      onAddInvestment({
        name: formData.name,
        type: formData.investmentType,
        amount: formData.amount,
        currentValue: formData.currentValue
      })
    }
  }

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories
  const investmentTypes = ['Renda Fixa', 'Ações', 'FIIs', 'Tesouro', 'Cripto', 'ETF']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        
        <div className="modal-header">
          <h3 className="modal-title">
            {type === 'transaction' ? 'Nova Transação' : 
             type === 'goal' ? 'Nova Meta' : 'Novo Investimento'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'transaction' && (
            <>
              <div className="type-selector">
                <button 
                  type="button"
                  className={`type-btn ${transactionType === 'income' ? 'active--income' : ''}`}
                  onClick={() => setTransactionType('income')}
                >
                  <ArrowUpCircle size={20} />
                  Receita
                </button>
                <button 
                  type="button"
                  className={`type-btn ${transactionType === 'expense' ? 'active--expense' : ''}`}
                  onClick={() => setTransactionType('expense')}
                >
                  <ArrowDownCircle size={20} />
                  Despesa
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <input 
                  type="text" 
                  name="description"
                  className="form-input" 
                  placeholder="Ex: Salário, Aluguel..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select 
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Valor</label>
                <input 
                  type="number" 
                  name="amount"
                  className="form-input" 
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data</label>
                <input 
                  type="date" 
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {type === 'goal' && (
            <>
              <div className="form-group">
                <label className="form-label">Nome da Meta</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="Ex: Viagem, Carro novo..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Alvo</label>
                <input 
                  type="number" 
                  name="target"
                  className="form-input" 
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.target}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Atual (opcional)</label>
                <input 
                  type="number" 
                  name="current"
                  className="form-input" 
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.current}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prazo</label>
                <input 
                  type="date" 
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {type === 'investment' && (
            <>
              <div className="form-group">
                <label className="form-label">Nome do Ativo</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="Ex: PETR4, CDB 120%..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select 
                  name="investmentType"
                  className="form-select"
                  value={formData.investmentType}
                  onChange={handleChange}
                  required
                >
                  {investmentTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Valor Investido</label>
                <input 
                  type="number" 
                  name="amount"
                  className="form-input" 
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Atual</label>
                <input 
                  type="number" 
                  name="currentValue"
                  className="form-input" 
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.currentValue}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn--primary btn--block">
            {type === 'transaction' ? 'Adicionar Transação' : 
             type === 'goal' ? 'Criar Meta' : 'Adicionar Investimento'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
