import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Header } from './dashboard/Header'
import { Card } from './components/ui/Card'
import { PercentileChip } from './components/ui/PercentileChip'
import { DistributionChart } from './components/ui/DistributionChart'
import { computeQuartiles } from './lib/quartiles'
import './index.css'

function Preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Header
        playerName="Jordan Micheals"
        photoUrl={null}
        repsRating={87}
        shotsTaken={412}
        repsDone={1280}
        trainingTimeMinutes={340}
        onSignOut={() => {}}
        onPrint={() => {}}
      />
      <Header
        playerName="Alex Rivera"
        photoUrl={null}
        repsRating={52}
        shotsTaken={210}
        repsDone={640}
        trainingTimeMinutes={120}
        onSignOut={() => {}}
      />
      <Header
        playerName="Sam Lee"
        photoUrl={null}
        repsRating={21}
        shotsTaken={80}
        repsDone={300}
        trainingTimeMinutes={45}
        onSignOut={() => {}}
      />
    </div>
  )
}

const mockCategoryValues = [40, 55, 60, 65, 70, 75, 78, 82, 87, 91, 95]
const mockCategoryStats = computeQuartiles(mockCategoryValues)

const mockSubcategories = [
  { name: 'Standing Vertical', unit: 'in', rawValues: [22, 24, 26, 28, 29, 30, 31, 33, 35], playerValue: 30, rank: 12, percentile: 74 },
  { name: 'Max Vertical', unit: 'in', rawValues: [26, 28, 30, 31, 33, 34, 36, 38], playerValue: 34, rank: 20, percentile: 61 },
  { name: '3/4 Court Sprint', unit: 'sec', rawValues: [3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7], playerValue: 3.3, rank: 8, percentile: 82, lowerIsBetter: true },
  { name: 'Skills Course', unit: 'sec', rawValues: [], playerValue: null, rank: null, percentile: null },
]

function PrintPreview() {
  return (
    <div className="print-report">
      <div className="print-toolbar no-print">
        <button type="button" className="sign-out-button">← Back to Dashboard</button>
        <button type="button" className="sign-out-button print-button">Print</button>
      </div>
      <Header
        playerName="Jordan Micheals"
        photoUrl={null}
        repsRating={87}
        shotsTaken={412}
        repsDone={1280}
        trainingTimeMinutes={340}
      />
      <div className="print-body">
        {['Athleticism', 'Shooting'].map((categoryName) => (
          <section key={categoryName} className="print-category">
            <Card className="print-category-card">
              <div className="print-row">
                <div className="print-row-info">
                  <h2 className="category-header-title">{categoryName}</h2>
                  <PercentileChip percentile={78} rank={14} size="lg" />
                </div>
                <div className="print-row-chart">
                  <DistributionChart
                    stats={mockCategoryStats}
                    playerValue={78}
                    formatValue={(v) => `${Math.round(v)}th percentile`}
                    showAxis={false}
                  />
                </div>
              </div>
            </Card>
            <h3 className="section-subheader print-subheader">Contributing Drills</h3>
            <div className="subcategory-list">
              {mockSubcategories.map((sub) => {
                const hasResult = sub.playerValue !== null
                const stats = sub.rawValues.length > 0 ? computeQuartiles(sub.rawValues) : null
                return (
                  <Card key={sub.name} className="subcategory-card">
                    <div className="print-row">
                      <div className="print-row-info">
                        <div className="subcategory-info">
                          <span className="subcategory-name">{sub.name}</span>
                          <span className="subcategory-raw">
                            {hasResult ? `${sub.playerValue} ${sub.unit}` : '—'}
                          </span>
                        </div>
                        {hasResult ? (
                          <PercentileChip percentile={sub.percentile!} rank={sub.rank!} />
                        ) : (
                          <span className="subcategory-missing">No result</span>
                        )}
                      </div>
                      <div className="print-row-chart">
                        {hasResult && stats ? (
                          <DistributionChart
                            stats={stats}
                            playerValue={sub.playerValue!}
                            formatValue={(v) => `${v.toFixed(1)} ${sub.unit}`}
                            lowerIsBetter={sub.lowerIsBetter}
                            showAxis
                          />
                        ) : (
                          <div className="print-chart-placeholder">No distribution data</div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <Preview />
      <PrintPreview />
    </div>
  </StrictMode>,
)
