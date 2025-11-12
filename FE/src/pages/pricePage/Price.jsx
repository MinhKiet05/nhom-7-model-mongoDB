import React, { useState, useEffect } from 'react';
import PriceService from '../../services/priceService.js';
import './Price.css';

const Price = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load prices from API
  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PriceService.getAllPrices();

      if (!Array.isArray(data)) {
        setError('Failed to load prices - invalid response');
        return;
      }

      // Normalize incoming price documents to a flat list of price entries.
      // Support two shapes:
      // 1) New flat document per price entry: { PriceID, ProductID, UnitID, Price, IsCurrent, Start, End, OtherTax, Note, Info }
      // 2) Legacy grouped document: { PriceID, ProductID, UnitID, PriceList: [{ Price, Start, End, OtherTax, Note, IsCurrent }] }
      const normalized = [];

      data.forEach(doc => {
        const looksLikeFlat = doc.hasOwnProperty('Price') || doc.hasOwnProperty('IsCurrent') || (!Array.isArray(doc.PriceList) && doc.Start);

        if (looksLikeFlat) {
          // Treat doc as a single price entry
          normalized.push({
            _id: doc._id,
            PriceID: doc.PriceID ? String(doc.PriceID) : '',
            ProductID: doc.ProductID ? String(doc.ProductID) : '',
            UnitID: doc.UnitID ? String(doc.UnitID) : '',
            Price: doc.Price != null ? Number(doc.Price) : 0,
            IsCurrent: !!doc.IsCurrent,
            Start: doc.Start || null,
            End: doc.End || null,
            OtherTax: Array.isArray(doc.OtherTax) ? doc.OtherTax : (doc.OtherTax ? [String(doc.OtherTax)] : []),
            Note: doc.Note || '',
            Info: doc.Info || {}
          });
        } else if (Array.isArray(doc.PriceList)) {
          // Expand legacy PriceList entries into flat rows
          doc.PriceList.forEach(pl => {
            normalized.push({
              _id: doc._id,
              PriceID: doc.PriceID ? String(doc.PriceID) : '',
              ProductID: doc.ProductID ? String(doc.ProductID) : '',
              UnitID: doc.UnitID ? String(doc.UnitID) : '',
              Price: pl.Price != null ? Number(pl.Price) : 0,
              IsCurrent: !!pl.IsCurrent,
              Start: pl.Start || null,
              End: pl.End || null,
              OtherTax: Array.isArray(pl.OtherTax) ? pl.OtherTax : (pl.OtherTax ? [String(pl.OtherTax)] : []),
              Note: pl.Note || doc.Note || '',
              Info: doc.Info || {}
            });
          });
        }
      });

      console.log('✅ Normalized prices:', normalized);
      console.log(`📈 Total entries: ${normalized.length}`);
      setPrices(normalized);
      setFilteredPrices(normalized);
    } catch (err) {
      console.error('❌ Error loading prices:', err);
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm giá
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredPrices(prices);
    } else {
      const filtered = prices.filter(price => {
        const priceId = typeof price.PriceID === 'string' ? price.PriceID : String(price.PriceID || '');
        const productId = typeof price.ProductID === 'string' ? price.ProductID : String(price.ProductID || '');
        const unitId = typeof price.UnitID === 'string' ? price.UnitID : String(price.UnitID || '');
        const createBy = price.Info?.CreateBy ? String(price.Info.CreateBy) : '';
        
        return priceId.toLowerCase().includes(value) ||
               productId.toLowerCase().includes(value) ||
               unitId.toLowerCase().includes(value) ||
               createBy.toLowerCase().includes(value);
      });
      setFilteredPrices(filtered);
    }
  };

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return Number(amount).toLocaleString('vi-VN') + '₫';
  };

  // Check if price entry is expired
  const isPriceExpired = (entry) => {
    if (!entry || !entry.End) return false;
    try {
      return new Date(entry.End) < new Date();
    } catch (e) {
      return false;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="page-content">
        <h1>Quản lý Giá cả</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu giá cả...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="page-content">
        <h1>Quản lý Giá cả</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <div>Lỗi: {error}</div>
          <button onClick={loadPrices} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Quản lý Giá cả</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input-main"
          placeholder="Tìm kiếm theo mã giá, mã sản phẩm, đơn vị..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="table-info">
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px'}}>
          {searchTerm ? (
            <>
              Tìm thấy: <strong>{filteredPrices.length}</strong> bảng giá 
              <span style={{color: '#3b82f6'}}> (từ khóa: "{searchTerm}")</span>
            </>
          ) : (
            <>Tổng cộng: <strong>{prices.length}</strong> bảng giá</>
          )}
        </p>
      </div>

      <div className="price-table">
        <table>
          <thead>
            <tr>
              <th className="price-col-id">Mã giá</th>
              <th className="price-col-product">Sản phẩm</th>
              <th className="price-col-current">Giá hiện tại</th>
              <th className="price-col-period">Thời gian áp dụng</th>
              <th className="price-col-tax">Thuế khác</th>
              <th className="price-col-info">Thông tin</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.length > 0 ? (
              filteredPrices.map(entry => {
                const isExpired = isPriceExpired(entry);
                
                return (
                  <tr key={String(entry._id || entry.PriceID || Math.random())} className={entry.Info?.Status !== 'Active' ? 'inactive-row' : ''}>
                    {/* Mã giá */}
                    <td className="price-col-id">
                      <div className="price-id-info">
                        <strong style={{fontSize: '14px', color: '#1f2937'}}>{entry.PriceID || 'N/A'}</strong>
                        <div style={{fontSize: '10px', color: '#6b7280', marginTop: '2px'}}>
                          ID: {entry._id ? String(entry._id).slice(-8) : 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Sản phẩm */}
                    <td className="price-col-product">
                      <div className="product-info">
                        <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#1f2937'}}>
                          {entry.ProductID || 'N/A'}
                        </div>
                        <div style={{fontSize: '12px', color: '#6b7280'}}>
                          Đơn vị: <span style={{fontWeight: '500'}}>{entry.UnitID || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Giá hiện tại */}
                    <td className="price-col-current">
                      <div className="current-price">
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: isExpired ? '#dc2626' : '#059669',
                          marginBottom: '4px'
                        }}>
                          {entry.Price != null ? formatCurrency(entry.Price) : 'N/A'}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: isExpired ? '#dc2626' : '#6b7280',
                          fontWeight: '500'
                        }}>
                          {isExpired ? 'Hết hiệu lực' : (entry.IsCurrent ? 'Đang áp dụng' : 'Không phải giá hiện tại')}
                        </div>
                      </div>
                    </td>

                    {/* Thời gian áp dụng */}
                    <td className="price-col-period">
                      <div className="period-info">
                        {entry.Start || entry.End ? (
                          <>
                            <div style={{fontSize: '12px', marginBottom: '4px'}}>
                              <div style={{color: '#6b7280', fontSize: '10px'}}>Từ ngày:</div>
                              <div style={{fontWeight: '500', color: '#059669'}}>
                                {formatDate(entry.Start)}
                              </div>
                            </div>
                            <div style={{fontSize: '12px'}}>
                              <div style={{color: '#6b7280', fontSize: '10px'}}>Đến ngày:</div>
                              <div style={{
                                fontWeight: '500',
                                color: isExpired ? '#dc2626' : '#059669'
                              }}>
                                {formatDate(entry.End)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div style={{fontSize: '12px', color: '#6b7280', fontStyle: 'italic'}}>
                            Không có thông tin
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thuế khác */}
                    <td className="price-col-tax">
                      <div className="tax-info">
                        {entry.OtherTax && entry.OtherTax.length > 0 ? (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: '#fff7ed',
                            color: '#c2410c'
                          }}>
                            {entry.OtherTax.join(', ')}
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: '#f0f9ff',
                            color: '#0369a1'
                          }}>
                            Không có
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Thông tin */}
                    <td className="price-col-info">
                      <div className="info-details">
                        <div style={{fontSize: '12px', marginBottom: '6px'}}>
                          <div style={{color: '#6b7280', fontSize: '10px'}}>Tạo bởi:</div>
                          <div style={{fontWeight: '500', color: '#1f2937'}}>
                            {entry.Info?.CreateBy || 'N/A'}
                          </div>
                        </div>
                        <div style={{fontSize: '12px', marginBottom: '6px'}}>
                          <div style={{color: '#6b7280', fontSize: '10px'}}>Ngày tạo:</div>
                          <div style={{fontWeight: '500', color: '#1f2937'}}>
                            {formatDate(entry.Info?.CreateDate)}
                          </div>
                        </div>
                        <div style={{fontSize: '11px', color: '#6b7280', fontStyle: 'italic'}}>
                          {entry.Note || 'Không có ghi chú'}
                        </div>
                        <div style={{marginTop: '4px'}}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            backgroundColor: entry.Info?.Status === 'Active' ? '#dcfce7' : '#fef2f2',
                            color: entry.Info?.Status === 'Active' ? '#166534' : '#dc2626'
                          }}>
                            {entry.Info?.Status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-text">
                      {searchTerm ? 
                        `Không tìm thấy giá nào với từ khóa "${searchTerm}"` : 
                        'Không có dữ liệu giá cả'
                      }
                    </div>
                    <div className="no-results-suggestion">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Dữ liệu sẽ được hiển thị khi có giá cả'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Price;
