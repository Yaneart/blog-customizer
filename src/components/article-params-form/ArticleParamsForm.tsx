import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';
import clsx from 'clsx';
import { useClose } from 'src/hooks/useClose';
import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	isOpen?: boolean;
	onApply?: (state: ArticleStateType) => void;
	onReset?: () => void;
}

export const ArticleParamsForm = ({
	isOpen: forcedIsOpen,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState(defaultArticleState);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const actualIsOpen = forcedIsOpen !== undefined ? forcedIsOpen : isOpen;

	const toggleSidebar = () => {
		if (forcedIsOpen === undefined) {
			setIsOpen(!isOpen);
		}
	};

	const handleClose = () => {
		if (forcedIsOpen === undefined) {
			setIsOpen(false);
		}
	};

	useClose({
		isOpen: actualIsOpen,
		onClose: handleClose,
		rootRef: sidebarRef,
	})

	const handleFormChange =
		(field: keyof ArticleStateType) => (value: OptionType) => {
			setFormState((prev) => ({
				...prev,
				[field]: value,
			}));
		};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onReset?.();
	};

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApply?.(formState);
	};

	return (
		<>
			<ArrowButton isOpen={actualIsOpen} onClick={toggleSidebar} />
			<aside
				className={clsx(styles.container, actualIsOpen && styles.container_open)}
				ref={sidebarRef}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<div>
						<Text as='h1' size={31} weight={800} uppercase align='center'>
							ЗАДАЙТЕ ПАРАМЕТРЫ
						</Text>
					</div>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={handleFormChange('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleFormChange('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={handleFormChange('fontColor')}
					/>
					<div style={{ height: '100px' }}></div>
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={handleFormChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={handleFormChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
