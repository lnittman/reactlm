/** @jsx h */
import { h, Fragment } from 'preact';
import { useSignal, computed, effect } from '@preact/signals';
import { LLMHub } from '../llm/providers';
import { Model } from '../llm/openrouter';

interface Props {
  hub: LLMHub;
  onModelChange: (provider: string, model: string) => void;
  onClose?: () => void;
  className?: string;
}

export function ModelSelector({ hub, onModelChange, onClose, className = '' }: Props) {
  const providers = useSignal(hub.getProviders());
  const selectedProvider = useSignal('openrouter');
  const selectedModel = useSignal<string | null>(hub.getActiveModel());
  const modelList = useSignal<Model[]>([]);
  const searchQuery = useSignal('');
  const isLoading = useSignal(false);
  const isExpanded = useSignal(false);
  const showRecommended = useSignal(true);
  
  // Click outside handler
  effect(() => {
    if (!isExpanded.value) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.model-selector')) {
        isExpanded.value = false;
        if (onClose) onClose();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
  
  // Fetch models when provider changes or on mount
  effect(() => {
    const loadModels = async () => {
      if (selectedProvider.value === 'openrouter') {
        const client = hub.getClient('openrouter');
        if (client) {
          isLoading.value = true;
          try {
            const models = await client.getLatestModels();
            modelList.value = models;
          } catch (error) {
            console.error('Failed to load models:', error);
            modelList.value = [];
          } finally {
            isLoading.value = false;
          }
        }
      }
    };
    
    loadModels();
  });
  
  const filteredModels = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (!query) return modelList.value;
    
    return modelList.value.filter(model => 
      model.id.toLowerCase().includes(query) ||
      model.name.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query)
    );
  });
  
  const recommendedModels = computed(() => {
    return hub.getRecommendedModels();
  });
  
  const modelsByProvider = computed(() => {
    const grouped: Record<string, Model[]> = {};
    filteredModels.value.forEach(model => {
      const provider = model.provider;
      if (!grouped[provider]) grouped[provider] = [];
      grouped[provider].push(model);
    });
    
    // Sort providers by quality
    const providerOrder = ['anthropic', 'openai', 'google', 'meta-llama', 'mistralai'];
    const sortedProviders = Object.keys(grouped).sort((a, b) => {
      const aIndex = providerOrder.indexOf(a);
      const bIndex = providerOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    
    const result: Record<string, Model[]> = {};
    sortedProviders.forEach(provider => {
      result[provider] = grouped[provider].sort((a, b) => b.contextLength - a.contextLength);
    });
    
    return result;
  });
  
  const handleModelSelect = (model: Model) => {
    selectedModel.value = model.id;
    onModelChange(selectedProvider.value, model.id);
    isExpanded.value = false;
  };
  
  const formatPrice = (price: number): string => {
    return `$${(price * 1000).toFixed(3)}/1K`;
  };
  
  const formatContextLength = (length: number): string => {
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return `${length}`;
  };
  
  const getCurrentModel = (): Model | null => {
    return modelList.value.find(m => m.id === selectedModel.value) || null;
  };
  
  return (
    <div className={`model-selector ${className}`}>
      <div className="model-selector-header">
        <button
          className="model-selector-toggle"
          onClick={() => isExpanded.value = !isExpanded.value}
        >
          <div className="selected-model-info">
            {selectedModel.value ? (
              <Fragment>
                <span className="model-name">{getCurrentModel()?.name || selectedModel.value}</span>
                <span className="model-provider">{getCurrentModel()?.provider}</span>
              </Fragment>
            ) : (
              <span className="no-model">Select Model</span>
            )}
          </div>
          <span className={`expand-icon ${isExpanded.value ? 'expanded' : ''}`}>▼</span>
        </button>
      </div>
      
      {isExpanded.value && (
        <div className="model-selector-dropdown">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery.value}
              onInput={(e) => searchQuery.value = (e.target as HTMLInputElement).value}
              className="model-search-input"
            />
            
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={showRecommended.value}
                  onChange={(e) => showRecommended.value = (e.target as HTMLInputElement).checked}
                />
                Show recommended only
              </label>
            </div>
          </div>
          
          {isLoading.value ? (
            <div className="loading-models">
              <div className="loading-spinner"></div>
              Loading models...
            </div>
          ) : (
            <div className="model-list">
              {showRecommended.value && searchQuery.value === '' && (
                <div className="model-group">
                  <h4 className="group-title">✨ Recommended</h4>
                  <div className="model-items">
                    {recommendedModels.value.map(model => (
                      <button
                        key={model.id}
                        className={`model-option ${selectedModel.value === model.id ? 'selected' : ''}`}
                        onClick={() => handleModelSelect(model)}
                      >
                        <div className="model-info">
                          <div className="model-header">
                            <span className="model-name">{model.name}</span>
                            <span className="model-badge recommended">⭐</span>
                          </div>
                          <div className="model-details">
                            <span className="model-provider">{model.provider}</span>
                            <span className="model-context">{formatContextLength(model.contextLength)} ctx</span>
                            <span className="model-price">{formatPrice(model.pricing.prompt)}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {(!showRecommended.value || searchQuery.value !== '') && (
                <Fragment>
                  {Object.entries(modelsByProvider.value).map(([provider, models]) => (
                    <div key={provider} className="model-group">
                      <h4 className="group-title">
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        <span className="model-count">({models.length})</span>
                      </h4>
                      <div className="model-items">
                        {models.map(model => (
                          <button
                            key={model.id}
                            className={`model-option ${selectedModel.value === model.id ? 'selected' : ''}`}
                            onClick={() => handleModelSelect(model)}
                          >
                            <div className="model-info">
                              <div className="model-header">
                                <span className="model-name">{model.name}</span>
                                {recommendedModels.value.some(r => r.id === model.id) && (
                                  <span className="model-badge recommended">⭐</span>
                                )}
                              </div>
                              <div className="model-details">
                                <span className="model-context">{formatContextLength(model.contextLength)} ctx</span>
                                <span className="model-price">{formatPrice(model.pricing.prompt)}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </Fragment>
              )}
              
              {filteredModels.value.length === 0 && !isLoading.value && (
                <div className="no-models">
                  {searchQuery.value ? 'No models match your search.' : 'No models available.'}
                </div>
              )}
            </div>
          )}
          
          <div className="model-selector-footer">
            <div className="model-info-text">
              {filteredModels.value.length} models available
            </div>
          </div>
        </div>
      )}
    </div>
  );
}